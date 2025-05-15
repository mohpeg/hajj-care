const handleAsync = require('../../../lib/handle-async');

describe('handleAsync middleware', () => {
  // Mock console.error to avoid test logs
  console.error = jest.fn();
  
  test('should call the handler function with req, res, next parameters', async () => {
    const mockHandler = jest.fn();
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    const middleware = handleAsync(mockHandler);
    await middleware(mockReq, mockRes, mockNext);
    
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  test('should call next with the error when handler throws', async () => {
    const testError = new Error('Test error');
    const mockHandler = jest.fn().mockRejectedValue(testError);
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    const middleware = handleAsync(mockHandler);
    await middleware(mockReq, mockRes, mockNext);
    
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(console.error).toHaveBeenCalledWith(testError);
    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  test('should not call next when handler succeeds', async () => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    const middleware = handleAsync(mockHandler);
    await middleware(mockReq, mockRes, mockNext);
    
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle middleware that calls next directly', async () => {
    const mockHandler = jest.fn((req, res, next) => {
      next();
    });
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    const middleware = handleAsync(mockHandler);
    await middleware(mockReq, mockRes, mockNext);
    
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});