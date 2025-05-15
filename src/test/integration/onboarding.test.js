const { request, app } = require('./setup');
const db = require('../../models');
const { redisClient } = require('../../lib/redis');
const jwt = require('jsonwebtoken');

// Mock redis client
jest.mock('../../lib/redis', () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK')
  }
}));

describe('Onboarding API', () => {
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
  
  describe('POST /v1/onboarding/health-conditions', () => {
    beforeEach(() => {
      // Mock the specific database call for this endpoint
      db.ExtraMedicalRecord = {
        upsert: jest.fn().mockResolvedValue([{}, true])
      };
    });
    
    test('should save health conditions successfully', async () => {
      const response = await request(app)
        .post('/v1/onboarding/health-conditions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          has_hypertension: true,
          has_diabetes: true,
          has_cholesterol: false,
          has_heart_disease: false,
          has_kidney_disease: false,
          onboarding_health_conditions_completed: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Health conditions saved successfully');
      expect(db.ExtraMedicalRecord.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          hajj_id: mockPilgrimId,
          has_hypertension: true,
          has_diabetes: true,
        }),
        expect.any(Object)
      );
    });
    
    test('should return 401 when unauthorized', async () => {
      const response = await request(app)
        .post('/v1/onboarding/health-conditions')
        .send({
          has_hypertension: true,
          has_diabetes: true
        });
      
      expect(response.status).toBe(401);
    });
    
    test('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/v1/onboarding/health-conditions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          has_hypertension: 'not-a-boolean',
          has_diabetes: true
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('name', 'ValidationException');
    });
  });
  
  describe('POST /v1/onboarding/allergy', () => {
    beforeEach(() => {
      db.ExtraMedicalRecord = {
        upsert: jest.fn().mockResolvedValue([{}, true])
      };
    });
    
    test('should save allergy information successfully', async () => {
      const response = await request(app)
        .post('/v1/onboarding/allergy')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          has_drug_allergy: true,
          has_food_allergy: false,
          has_other_allergy: true,
          other_allergy_details: 'Dust allergy',
          onboarding_allergy_completed: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Allergy information saved successfully');
    });
  });
  
  describe('GET /v1/onboarding', () => {
    beforeEach(() => {
      db.ExtraMedicalRecord = {
        findOne: jest.fn().mockResolvedValue({
          dataValues: {
            onboarding_health_conditions_completed: true,
            onboarding_medical_procedures_completed: false,
            onboarding_allergy_completed: true
          }
        })
      };
    });
    
    test('should retrieve onboarding status successfully', async () => {
      const response = await request(app)
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('onboarding_health_conditions_completed', true);
      expect(response.body).toHaveProperty('onboarding_medical_procedures_completed', false);
      expect(response.body).toHaveProperty('onboarding_allergy_completed', true);
    });
    
    test('should return 404 when no onboarding data exists', async () => {
      db.ExtraMedicalRecord.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /v1/onboarding/all', () => {
    beforeEach(() => {
      // Mock pagination results
      db.ExtraMedicalRecord = {
        ...db.ExtraMedicalRecord,
        findAndCountAll: jest.fn().mockResolvedValue({
          count: 2,
          rows: [
            { 
              dataValues: { 
                hajj_id: 'hajj123', 
                has_diabetes: true,
                has_hypertension: false,
                onboarding_health_conditions_completed: true,
                onboarding_allergy_completed: true
              } 
            },
            { 
              dataValues: { 
                hajj_id: 'hajj456', 
                has_diabetes: false,
                has_hypertension: true,
                onboarding_health_conditions_completed: true,
                onboarding_allergy_completed: false
              } 
            }
          ]
        })
      };
    });
    
    test('should retrieve paginated onboarding data', async () => {
      // Create admin token - since this likely requires admin access
      const adminToken = jwt.sign(
        { userId: 1, role: 'admin', hajjId: 'admin1' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
      
      const response = await request(app)
        .get('/v1/onboarding/all?pageIndex=1&pageSize=10&order=ASC')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data).toHaveLength(2);
    });
    
    test('should return 403 for non-admin users', async () => {
      // Use regular pilgrim token
      const response = await request(app)
        .get('/v1/onboarding/all')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403); // Or 401 depending on your middleware
    });
  });

  describe('POST /v1/onboarding/medical-procedures', () => {
    beforeEach(() => {
      db.ExtraMedicalRecord = {
        upsert: jest.fn().mockResolvedValue([{}, true])
      };
    });
    
    test('should save medical procedures information successfully', async () => {
      const response = await request(app)
        .post('/v1/onboarding/medical-procedures')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          has_had_surgery: true,
          surgery_details: 'Appendectomy in 2023',
          has_device_implant: false,
          takes_medication_regularly: true,
          medication_details: 'Metformin 500mg daily',
          onboarding_medical_procedures_completed: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Medical procedures information saved successfully');
      expect(db.ExtraMedicalRecord.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          hajj_id: mockPilgrimId,
          has_had_surgery: true,
          surgery_details: 'Appendectomy in 2023'
        }),
        expect.any(Object)
      );
    });
    
    test('should return 400 for invalid medical procedures data', async () => {
      const response = await request(app)
        .post('/v1/onboarding/medical-procedures')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          has_had_surgery: 'not-a-boolean',
          takes_medication_regularly: true
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('name', 'ValidationException');
    });
  });
});
