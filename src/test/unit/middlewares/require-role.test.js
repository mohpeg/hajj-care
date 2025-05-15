const requireRoles = require('../../../middlewares/require-role');
const { ROLES } = require('../../../constants/roles');

describe('Role-based Authorization Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      user: {
        userId: 1,
        hajjId: 'test123',
        role: ROLES.PILGRIM
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Spy on console.error to prevent it from printing during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    console.error.mockRestore();
  });

  test('should call next when user has the required role', () => {
    const middleware = requireRoles([ROLES.PILGRIM]);
    middleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  test('should call next when user has at least one of the required roles', () => {
    const middleware = requireRoles([ROLES.ADMIN, ROLES.PILGRIM]);
    middleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  test('should return 403 when user does not have the required role', () => {
    const middleware = requireRoles([ROLES.ADMIN]);
    middleware(req, res, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });
  
  test('should return 401 when user property is missing', () => {
    req.user = undefined;
    const middleware = requireRoles([ROLES.PILGRIM]);
    middleware(req, res, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  
  test('should return 401 when user role is missing', () => {
    req.user = { userId: 1 }; // No role property
    const middleware = requireRoles([ROLES.PILGRIM]);
    middleware(req, res, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  
  test('should return 500 when an invalid role is provided', () => {
    const middleware = requireRoles(['non-existent-role']);
    middleware(req, res, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(console.error).toHaveBeenCalled();
  });
});