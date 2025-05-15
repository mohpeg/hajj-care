const { request, app } = require('./setup');
const db = require('../../models');
const jwt = require('jsonwebtoken');

// Mock redis client
jest.mock('../../lib/redis', () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK')
  }
}));

describe('Statistics API', () => {
  let authToken;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a test auth token for an admin user
    authToken = jwt.sign(
      { userId: 1, role: 'admin', hajjId: 'admin123' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
    
    // Mock the sequelize query method
    db.sequelize = {
      query: jest.fn()
    };
  });
  
  describe('GET /v1/statistics/{dashboardName}', () => {
    test('should retrieve user statistics dashboard', async () => {
      // Mock the query result for user statistics
      db.sequelize.query.mockResolvedValueOnce([{
        TotalUsers: 100,
        Pilgrims: 80,
        Doctors: 10,
        Admins: 5,
        Moderators: 5
      }]);
      
      const response = await request(app)
        .get('/v1/statistics/userStatistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('TotalUsers', 100);
      expect(response.body).toHaveProperty('Pilgrims', 80);
      expect(response.body).toHaveProperty('Doctors', 10);
    });
    
    test('should retrieve medical statistics dashboard', async () => {
      // Mock the query result for medical statistics
      db.sequelize.query.mockResolvedValueOnce([{
        TotalMedicalExaminations: 250,
        HypertensionCount: 45,
        DiabetesCount: 30,
        HeartDiseaseCount: 15
      }]);
      
      const response = await request(app)
        .get('/v1/statistics/medicalStatistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('TotalMedicalExaminations', 250);
      expect(response.body).toHaveProperty('HypertensionCount', 45);
      expect(response.body).toHaveProperty('DiabetesCount', 30);
    });
    
    test('should return 404 for unknown dashboard', async () => {
      // Mock no results for unknown dashboard
      db.sequelize.query.mockResolvedValueOnce([]);
      
      const response = await request(app)
        .get('/v1/statistics/unknownDashboard')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('name', 'NotFoundException');
    });
    
    test('should return 403 when non-admin tries to access', async () => {
      // Create a test token with pilgrim role
      const pilgrimToken = jwt.sign(
        { userId: 2, role: 'pilgrim', hajjId: 'hajj123' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
      
      const response = await request(app)
        .get('/v1/statistics/userStatistics')
        .set('Authorization', `Bearer ${pilgrimToken}`);
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('name', 'ForbiddenException');
    });
    
    test('should handle database error gracefully', async () => {
      // Mock a database error
      db.sequelize.query.mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app)
        .get('/v1/statistics/userStatistics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('name', 'InternalServerException');
    });
  });
});