const { request, app } = require('./setup');
const db = require('../../models');
const jwt = require('jsonwebtoken');
const path = require('path');

// Mock file uploads
jest.mock('multer', () => {
  const multer = () => ({
    single: () => (req, res, next) => {
      if (req.body && req.body._testFile) {
        req.file = {
          filename: 'test-passport.jpg',
          path: '/uploads/test-passport.jpg'
        };
      }
      next();
    }
  });
  multer.diskStorage = () => ({});
  return multer;
});

// Mock redis client
jest.mock('../../lib/redis', () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK')
  }
}));

describe('Profile API', () => {
  let authToken;
  const mockPilgrimId = 'hajj123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a test auth token
    authToken = jwt.sign(
      { userId: 1, role: 'pilgrim', hajjId: mockPilgrimId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
    
    // Mock database methods
    db.sequelize = {
      transaction: jest.fn(callback => callback({ commit: jest.fn(), rollback: jest.fn() }))
    };
  });
  
  describe('GET /v1/pilgrim/profile', () => {
    beforeEach(() => {
      db.PilgrimsData = {
        findOne: jest.fn().mockResolvedValue({
          pilgrim_id: mockPilgrimId,
          pilgrim_name_en: 'John Doe',
          pilgrim_passport_no: 'AB123456',
          pilgrim_nationality: 'USA',
          pilgrim_gender: 'Male',
          pilgrim_phone: '+1234567890',
          pilgrim_email: 'john@example.com',
          pilgrim_passport_img: '/uploads/passport123.jpg'
        })
      };
    });
    
    test('should retrieve pilgrim profile successfully', async () => {
      const response = await request(app)
        .get('/v1/pilgrim/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('hajjId', mockPilgrimId);
      expect(response.body).toHaveProperty('name', 'John Doe');
      expect(response.body).toHaveProperty('passport', 'AB123456');
      expect(response.body).toHaveProperty('phone', '+1234567890');
    });
    
    test('should return 404 when profile not found', async () => {
      db.PilgrimsData.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/v1/pilgrim/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('name', 'NotFoundException');
    });
  });
  
  describe('POST /v1/pilgrim/profile', () => {
    beforeEach(() => {
      db.PilgrimsData = {
        update: jest.fn().mockResolvedValue([1]),
        findOne: jest.fn().mockResolvedValue({
          pilgrim_id: mockPilgrimId,
          pilgrim_name_en: 'John Doe',
          pilgrim_nationality: 'USA'
        })
      };
    });
    
    test('should update pilgrim contact information', async () => {
      const response = await request(app)
        .post('/v1/pilgrim/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .field('phone', '+9876543210')
        .field('email', 'updated@example.com')
        .field('_testFile', 'true'); // This triggers our mock to add a file
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(db.PilgrimsData.update).toHaveBeenCalledWith(
        expect.objectContaining({
          pilgrim_phone: '+9876543210',
          pilgrim_email: 'updated@example.com',
          pilgrim_passport_img: expect.any(String)
        }),
        expect.any(Object)
      );
    });
    
    test('should return 400 for invalid phone number', async () => {
      const response = await request(app)
        .post('/v1/pilgrim/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .field('phone', 'invalid-phone')
        .field('email', 'valid@example.com');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('name', 'ValidationException');
    });
  });
  
  describe('GET /v1/pilgrim/profile/list', () => {
    beforeEach(() => {
      // Mock for the admin role
      authToken = jwt.sign(
        { userId: 1, role: 'admin', hajjId: 'admin123' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
      
      db.PilgrimsData = {
        findAndCountAll: jest.fn().mockResolvedValue({
          count: 2,
          rows: [
            {
              pilgrim_id: 'hajj123',
              pilgrim_name_en: 'John Doe',
              pilgrim_nationality: 'USA',
              pilgrim_gender: 'Male',
              pilgrim_phone: '+1234567890'
            },
            {
              pilgrim_id: 'hajj456',
              pilgrim_name_en: 'Jane Smith',
              pilgrim_nationality: 'UK',
              pilgrim_gender: 'Female',
              pilgrim_phone: '+9876543210'
            }
          ]
        })
      };
    });
    
    test('should retrieve paginated list of pilgrim profiles', async () => {
      const response = await request(app)
        .get('/v1/pilgrim/profile/list')
        .query({ pageIndex: 1, pageSize: 10 })
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(2);
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('total', 2);
      expect(response.body.meta).toHaveProperty('pageIndex', 1);
    });
    
    test('should return 403 when non-admin tries to access', async () => {
      // Switch back to pilgrim role
      authToken = jwt.sign(
        { userId: 1, role: 'pilgrim', hajjId: mockPilgrimId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
      
      const response = await request(app)
        .get('/v1/pilgrim/profile/list')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('name', 'ForbiddenException');
    });
  });
});