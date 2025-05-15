const { getToken } = require('../../../../user-account/services/token.service');
const bcrypt = require('bcryptjs');
const db = require('../../../../models');
const jwt = require('../../../../lib/jwt');
const { ValidationException, UnauthorizedException } = require('../../../../exceptions');

jest.mock('bcryptjs');
jest.mock('../../../../models', () => ({
  UserAccount: {
    findOne: jest.fn()
  }
}));
jest.mock('../../../../lib/jwt');
jest.mock('../../../../validation/validateCredentials', () => ({
  validateCredentials: jest.fn().mockReturnValue({ value: {} })
}));

describe('Token Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    beforeEach(() => {
      // Setup default mocks for JWT functions
      jwt.generateAccessToken = jest.fn().mockReturnValue('mocked-access-token');
      jwt.generateRefreshToken = jest.fn().mockReturnValue('mocked-refresh-token');
      jwt.verifyToken = jest.fn().mockReturnValue({ sub: 1 });
    });

    describe('username:password grant type', () => {
      const credentials = {
        grant_type: 'username:password',
        username: 'testuser',
        password: 'password123'
      };

      test('should return tokens for valid username and password', async () => {
        const mockUser = { 
          id: 1, 
          username: 'testuser', 
          hashedPassword: 'hashed-password',
          role: 'pilgrim',
          hajjId: 'hajj123'
        };
        
        db.UserAccount.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);

        const result = await getToken(credentials);
        
        expect(db.UserAccount.findOne).toHaveBeenCalledWith({ 
          where: { username: 'testuser' } 
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
        expect(jwt.generateAccessToken).toHaveBeenCalledWith({
          accountId: 1,
          role: 'pilgrim',
          hajjId: 'hajj123'
        });
        expect(jwt.generateRefreshToken).toHaveBeenCalledWith({ accountId: 1 });
        expect(result).toEqual({
          access_token: 'mocked-access-token',
          refresh_token: 'mocked-refresh-token'
        });
      });

      test('should throw UnauthorizedException for invalid username', async () => {
        db.UserAccount.findOne.mockResolvedValue(null);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });

      test('should throw UnauthorizedException for invalid password', async () => {
        const mockUser = { 
          id: 1, 
          username: 'testuser', 
          hashedPassword: 'hashed-password' 
        };
        
        db.UserAccount.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });
    });

    describe('national_id grant type', () => {
      const credentials = {
        grant_type: 'national_id',
        nationalId: '123456789'
      };

      test('should return tokens for valid national ID', async () => {
        const mockUser = { 
          id: 1, 
          nationalId: '123456789',
          role: 'pilgrim',
          hajjId: 'hajj123'
        };
        
        db.UserAccount.findOne.mockResolvedValue(mockUser);

        const result = await getToken(credentials);
        
        expect(db.UserAccount.findOne).toHaveBeenCalledWith({ 
          where: { nationalId: '123456789' } 
        });
        expect(jwt.generateAccessToken).toHaveBeenCalledWith({
          accountId: 1,
          role: 'pilgrim',
          hajjId: 'hajj123'
        });
        expect(jwt.generateRefreshToken).toHaveBeenCalledWith({ accountId: 1 });
        expect(result).toEqual({
          access_token: 'mocked-access-token',
          refresh_token: 'mocked-refresh-token'
        });
      });

      test('should throw UnauthorizedException for invalid national ID', async () => {
        db.UserAccount.findOne.mockResolvedValue(null);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });
    });

    describe('passport_number grant type', () => {
      const credentials = {
        grant_type: 'passport_number',
        passportNumber: 'ABC123'
      };

      test('should return tokens for valid passport number', async () => {
        const mockUser = { 
          id: 1, 
          passportNumber: 'ABC123',
          role: 'pilgrim',
          hajjId: 'hajj123'
        };
        
        db.UserAccount.findOne.mockResolvedValue(mockUser);

        const result = await getToken(credentials);
        
        expect(db.UserAccount.findOne).toHaveBeenCalledWith({ 
          where: { passportNumber: 'ABC123' } 
        });
        expect(jwt.generateAccessToken).toHaveBeenCalledWith({
          accountId: 1,
          role: 'pilgrim',
          hajjId: 'hajj123'
        });
        expect(jwt.generateRefreshToken).toHaveBeenCalledWith({ accountId: 1 });
        expect(result).toEqual({
          access_token: 'mocked-access-token',
          refresh_token: 'mocked-refresh-token'
        });
      });

      test('should throw UnauthorizedException for invalid passport number', async () => {
        db.UserAccount.findOne.mockResolvedValue(null);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });
    });

    describe('refresh_token grant type', () => {
      const credentials = {
        grant_type: 'refresh_token',
        refresh_token: 'valid-refresh-token'
      };

      test('should return new tokens for valid refresh token', async () => {
        const mockUser = { 
          id: 1, 
          role: 'pilgrim',
          hajjId: 'hajj123'
        };
        
        jwt.verifyToken.mockReturnValue({ sub: 1 });
        db.UserAccount.findOne.mockResolvedValue(mockUser);

        const result = await getToken(credentials);
        
        expect(jwt.verifyToken).toHaveBeenCalledWith('valid-refresh-token');
        expect(db.UserAccount.findOne).toHaveBeenCalledWith({ 
          where: { id: 1 } 
        });
        expect(jwt.generateAccessToken).toHaveBeenCalledWith({
          accountId: 1,
          role: 'pilgrim',
          hajjId: 'hajj123'
        });
        expect(jwt.generateRefreshToken).toHaveBeenCalledWith({ accountId: 1 });
        expect(result).toEqual({
          access_token: 'mocked-access-token',
          refresh_token: 'mocked-refresh-token'
        });
      });

      test('should throw UnauthorizedException for invalid refresh token', async () => {
        jwt.verifyToken.mockReturnValue(null);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });

      test('should throw UnauthorizedException when user not found', async () => {
        jwt.verifyToken.mockReturnValue({ sub: 1 });
        db.UserAccount.findOne.mockResolvedValue(null);
        
        await expect(getToken(credentials))
          .rejects
          .toThrow(UnauthorizedException);
      });
    });

    test('should throw ValidationException for unsupported grant type', async () => {
      const credentials = {
        grant_type: 'unsupported_type'
      };
      
      await expect(getToken(credentials))
        .rejects
        .toThrow(ValidationException);
    });
  });
});