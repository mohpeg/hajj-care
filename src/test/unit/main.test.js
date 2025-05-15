const app = require('../../app');
const db = require('../../models/index');
const main = require('../../main');

jest.mock('../../app', () => ({
  listen: jest.fn((port, host, callback) => {
    callback();
    return { close: jest.fn() };
  })
}));

jest.mock('../../models/index', () => ({
  sequelize: {
    authenticate: jest.fn()
  }
}));

// Mock console.log to avoid cluttering test output
console.log = jest.fn();

describe('Main application bootstrap', () => {
  let originalEnv;
  
  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    // Set default PORT to 3001 for tests
    process.env.PORT = '3001';
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  test('should connect to the database and start the server', async () => {
    // Mock successful DB connection
    db.sequelize.authenticate.mockResolvedValueOnce();
    
    // Get the bootstrap function directly
    const bootstrap = require('../../main').bootstrap;
    await bootstrap();
    
    expect(db.sequelize.authenticate).toHaveBeenCalledTimes(1);
    expect(app.listen).toHaveBeenCalledWith(3001, '0.0.0.0', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Connection to database was established successfully');
    expect(console.log).toHaveBeenCalledWith('Server listening on port 3001 on all interfaces');
  });
  
  test('should use PORT from environment variable if available', async () => {
    // Set PORT environment variable
    process.env.PORT = '4000';
    
    // Mock successful DB connection
    db.sequelize.authenticate.mockResolvedValueOnce();
    
    // Get the bootstrap function directly
    const bootstrap = require('../../main').bootstrap;
    await bootstrap();
    
    expect(app.listen).toHaveBeenCalledWith(4000, '0.0.0.0', expect.any(Function));
  });
  
  test('should handle database connection errors', async () => {
    // Mock failed DB connection
    const dbError = new Error('Test DB connection error');
    db.sequelize.authenticate.mockRejectedValueOnce(dbError);
    
    // Get the bootstrap function directly
    const bootstrap = require('../../main').bootstrap;
    await bootstrap();
    
    expect(db.sequelize.authenticate).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(`Connection failed : Error: Test DB connection error`);
    expect(app.listen).toHaveBeenCalledWith(3001, '0.0.0.0', expect.any(Function));
  });
});