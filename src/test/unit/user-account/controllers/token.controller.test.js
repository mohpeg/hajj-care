const { grantToken, revokeToken } = require('../../../../user-account/controllers/token.controller');
const tokenService = require('../../../../user-account/services/token.service');
const { redisClient } = require('../../../../lib/redis');
const { verifyToken } = require('../../../../lib/jwt');
const { ValidationException, UnauthorizedException } = require('../../../../exceptions');

// Mock dependencies
jest.mock('../../../../user-account/services/token.service');
jest.mock('../../../../lib/redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn()
  }
}));
jest.mock('../../../../lib/jwt', () => ({
  verifyToken: jest.fn()
}));

describe('Token Controller', () => {
  // Mock Express request and response
  let mockReq;
  let mockRes;
  
  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('grantToken', () => {
    test('should call tokenService.getToken and return result with status 200', async () => {
      // Setup
      const mockTokenResponse = { 
        access_token: 'mock-access-token', 
        refresh_token: 'mock-refresh-token' 
      };
      mockReq.body = { grant_type: 'passport_number', passportNumber: '123456' };
      tokenService.getToken.mockResolvedValueOnce(mockTokenResponse);
      
      // Execute
      await grantToken(mockReq, mockRes);
      
      // Assert
      expect(tokenService.getToken).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTokenResponse);
    });

    test('should propagate errors from tokenService', async () => {
      // Setup
      const mockError = new Error('Test error');
      mockReq.body = { grant_type: 'invalid' };
      tokenService.getToken.mockRejectedValueOnce(mockError);
      
      // Execute & Assert
      await expect(grantToken(mockReq, mockRes)).rejects.toThrow('Test error');
    });
  });

  describe('revokeToken', () => {
    test('should return 400 if refresh token is missing', async () => {
      // Setup
      mockReq.body = { }; // No refresh token
      
      // Execute
      await revokeToken(mockReq, mockRes);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Refresh token is required' })
      );
    });

    test('should return 401 if refresh token is invalid', async () => {
      // Setup
      mockReq.body = { refreshToken: 'invalid-token' };
      const jwtError = new Error('Invalid token');
      verifyToken.mockImplementationOnce(() => { throw jwtError; });
      
      // Execute
      await revokeToken(mockReq, mockRes);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid token' })
      );
    });

    test('should return 401 if refresh token is already revoked', async () => {
      // Setup
      mockReq.body = { refreshToken: 'already-revoked-token' };
      verifyToken.mockReturnValueOnce({ exp: Math.floor(Date.now() / 1000) + 3600 });
      redisClient.get.mockResolvedValueOnce('revoked');
      
      // Execute
      await revokeToken(mockReq, mockRes);
      
      // Assert
      expect(redisClient.get).toHaveBeenCalledWith('already-revoked-token');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Refresh token is revoked' })
      );
    });

    test('should revoke token and return success message', async () => {
      // Setup
      const mockRefreshToken = 'valid-token';
      mockReq.body = { refreshToken: mockRefreshToken };
      const mockDecodedToken = { exp: Math.floor(Date.now() / 1000) + 3600 }; // Expires in 1 hour
      
      verifyToken.mockReturnValueOnce(mockDecodedToken);
      redisClient.get.mockResolvedValueOnce(null); // Token not revoked
      redisClient.set.mockResolvedValueOnce('OK');
      
      // Execute
      await revokeToken(mockReq, mockRes);
      
      // Assert
      expect(verifyToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(redisClient.get).toHaveBeenCalledWith(mockRefreshToken);
      expect(redisClient.set).toHaveBeenCalledWith(
        mockRefreshToken, 
        'revoked', 
        expect.objectContaining({ EX: expect.any(Number) })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logout successfully' });
    });
  });
});