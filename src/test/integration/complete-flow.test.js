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

describe('Complete User Flow Tests', () => {
  let pilgrimToken, adminToken;
  const mockPilgrimId = 'hajj123';
  const mockAdminId = 'admin1';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create test tokens for different user roles
    pilgrimToken = jwt.sign(
      { userId: 1, role: 'pilgrim', hajjId: mockPilgrimId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
    
    adminToken = jwt.sign(
      { userId: 2, role: 'admin', hajjId: mockAdminId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
    
    // Mock database methods
    db.sequelize = {
      transaction: jest.fn(callback => callback({ commit: jest.fn(), rollback: jest.fn() }))
    };
    
    // Mock user account
    db.UserAccount = {
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        hajj_id: mockPilgrimId,
        role: 'pilgrim'
      }),
      findOne: jest.fn().mockResolvedValue({
        dataValues: {
          id: 1,
          hajj_id: mockPilgrimId,
          role: 'pilgrim',
          firstName: 'Test',
          lastName: 'User'
        }
      })
    };
    
    // Mock pilgrim data
    db.PilgrimsData = {
      findOne: jest.fn().mockResolvedValue({
        dataValues: {
          hajj_id: mockPilgrimId,
          name: 'Test User',
          passport: 'AB123456',
          nationality: 'Country',
          dateOfBirth: '1980-01-01',
        }
      })
    };
    
    // Mock medical record
    db.ExtraMedicalRecord = {
      upsert: jest.fn().mockResolvedValue([{}, true]),
      findOne: jest.fn().mockResolvedValue(null)
    };
  });
  
  describe('Pilgrim Onboarding Flow', () => {
    test('should complete full onboarding process successfully', async () => {
      // Step 1: Register a new user
      db.UserAccount.findOne.mockResolvedValueOnce(null); // User doesn't exist yet
      
      const registrationData = {
        passport: 'AB123456',
        password: 'SecurePassword123!',
        email: 'pilgrim@example.com',
        hajj_id: mockPilgrimId
      };
      
      const registrationResponse = await request(app)
        .post('/v1/auth/register')
        .send(registrationData);
        
      expect(registrationResponse.status).toBe(201);
      expect(db.UserAccount.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hajj_id: mockPilgrimId,
          passportNumber: 'AB123456'
        }),
        expect.any(Object)
      );
      
      // Step 2: Login 
      const loginResponse = await request(app)
        .post('/v1/auth/login')
        .send({
          passport: 'AB123456',
          password: 'SecurePassword123!'
        });
        
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('accessToken');
      
      // Step 3: Add health conditions
      const healthConditionsData = {
        has_hypertension: true,
        has_diabetes: true,
        has_cholesterol: false,
        has_heart_disease: false,
        has_kidney_disease: false,
        onboarding_health_conditions_completed: true
      };
      
      const healthResponse = await request(app)
        .post('/v1/onboarding/health-conditions')
        .set('Authorization', `Bearer ${pilgrimToken}`)
        .send(healthConditionsData);
        
      expect(healthResponse.status).toBe(200);
      expect(db.ExtraMedicalRecord.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          hajj_id: mockPilgrimId,
          has_hypertension: true,
          has_diabetes: true,
          onboarding_health_conditions_completed: true
        }),
        expect.any(Object)
      );
      
      // Step 4: Add medical procedures
      const medicalProceduresData = {
        has_had_surgery: true,
        surgery_details: 'Appendectomy in 2023',
        has_device_implant: false,
        takes_medication_regularly: true,
        medication_details: 'Metformin 500mg daily',
        onboarding_medical_procedures_completed: true
      };
      
      const proceduresResponse = await request(app)
        .post('/v1/onboarding/medical-procedures')
        .set('Authorization', `Bearer ${pilgrimToken}`)
        .send(medicalProceduresData);
        
      expect(proceduresResponse.status).toBe(200);
      
      // Step 5: Add allergy information
      const allergyData = {
        has_drug_allergy: true,
        has_food_allergy: false,
        has_other_allergy: true,
        other_allergy_details: 'Pollen allergy',
        onboarding_allergy_completed: true
      };
      
      const allergyResponse = await request(app)
        .post('/v1/onboarding/allergy')
        .set('Authorization', `Bearer ${pilgrimToken}`)
        .send(allergyData);
        
      expect(allergyResponse.status).toBe(200);
      
      // Step 6: Get onboarding status to verify all sections are completed
      db.ExtraMedicalRecord.findOne.mockResolvedValueOnce({
        dataValues: {
          onboarding_health_conditions_completed: true,
          onboarding_medical_procedures_completed: true,
          onboarding_allergy_completed: true
        }
      });
      
      const statusResponse = await request(app)
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${pilgrimToken}`);
        
      expect(statusResponse.status).toBe(200);
      expect(statusResponse.body).toHaveProperty('onboarding_health_conditions_completed', true);
      expect(statusResponse.body).toHaveProperty('onboarding_medical_procedures_completed', true);
      expect(statusResponse.body).toHaveProperty('onboarding_allergy_completed', true);
      
      // Step 7: Admin can view the pilgrim's data through the admin API
      db.ExtraMedicalRecord.findAndCountAll = jest.fn().mockResolvedValue({
        count: 1,
        rows: [{
          dataValues: {
            hajj_id: mockPilgrimId,
            has_diabetes: true,
            has_hypertension: true,
            has_drug_allergy: true,
            onboarding_health_conditions_completed: true,
            onboarding_medical_procedures_completed: true,
            onboarding_allergy_completed: true
          }
        }]
      });
      
      const adminViewResponse = await request(app)
        .get('/v1/onboarding/all')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(adminViewResponse.status).toBe(200);
      expect(adminViewResponse.body.data).toHaveLength(1);
      expect(adminViewResponse.body.data[0]).toHaveProperty('hajj_id', mockPilgrimId);
    });
  });
});