const jwt = require('jsonwebtoken');
const requireAuth = require('../../../middlewares/require-auth.middleware');
const { UnauthorizedException } = require('../../../exceptions/unauthorized.exception');

describe('Authentication Middleware', () => {
  let req, res, next, jwtSecret;
  
  beforeEach(() => {
    // Save original environment
    jwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret';
    
    // Setup mock request, response, and next function
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original environment
    process.env.JWT_SECRET = jwtSecret;
  });
  
  test('should pass with valid token in Authorization header', () => {
    const token = jwt.sign({ userId: 1, role: 'pilgrim', hajjId: 'test123' }, 'test-secret');
    req.headers.authorization = `Bearer ${token}`;
    
    requireAuth(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.hajjId).toBe('test123');
  });
  
  test('should return 401 with missing token', () => {
    requireAuth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Access token is missing'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 with invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token';
    
    requireAuth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Access token is invalid'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 with expired token', () => {
    // Create an expired token by setting a negative expiration
    const token = jwt.sign(
      { userId: 1, hajjId: 'test123' }, 
      'test-secret', 
      { expiresIn: '-10s' }
    );
    req.headers.authorization = `Bearer ${token}`;
    
    requireAuth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Access token has expired'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});