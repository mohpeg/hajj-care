const { request, app, createTestTokens } = require('./setup');
const db = require('../../models');
const bcrypt = require('bcryptjs');

jest.mock('../../lib/redis', () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK')
  }
}));

describe('Authentication API', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Mock the user find method to return test data
    db.UserAccount.findOne = jest.fn();
  });

  describe('POST /api/token', () => {
    test('should authenticate with username and password', async () => {
      // Mock a user in the database
      const mockUser = {
        id: 1,
        username: 'testuser',
        hashedPassword: await bcrypt.hash('password123', 10),
        role: 'admin',
        hajjId: 'hajj123'
      };
      
      db.UserAccount.findOne.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/token')
        .send({
          grant_type: 'username:password',
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    test('should authenticate with passport number', async () => {
      // Mock a user in the database
      const mockUser = {
        id: 2,
        passportNumber: 'ABC123',
        role: 'pilgrim',
        hajjId: 'hajj456'
      };
      
      db.UserAccount.findOne.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/token')
        .send({
          grant_type: 'passport_number',
          passportNumber: 'ABC123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    test('should authenticate with national ID', async () => {
      // Mock a user in the database
      const mockUser = {
        id: 3,
        nationalId: '123456789',
        role: 'doctor',
        hajjId: 'hajj789'
      };
      
      db.UserAccount.findOne.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/token')
        .send({
          grant_type: 'national_id',
          nationalId: '123456789'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    test('should return 401 for invalid credentials', async () => {
      // Mock no user found in database
      db.UserAccount.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/token')
        .send({
          grant_type: 'username:password',
          username: 'wronguser',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('name', 'UnauthorizedException');
    });

    test('should return 400 for invalid grant type', async () => {
      const response = await request(app)
        .post('/api/token')
        .send({
          grant_type: 'invalid_type',
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('name', 'ValidationException');
    });
  });

  describe('POST /api/revoke', () => {
    test('should revoke a refresh token', async () => {
      const { refresh_token } = createTestTokens();
      
      const response = await request(app)
        .post('/api/revoke')
        .send({
          refreshToken: refresh_token
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successfully');
    });

    test('should return 400 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/api/revoke')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('name', 'ValidationException');
    });
  });

  describe('POST /api/refresh', () => {
    test('should refresh access token with valid refresh token', async () => {
      const { refresh_token } = createTestTokens();
      
      const response = await request(app)
        .post('/api/refresh')
        .send({
          refreshToken: refresh_token
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    test('should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/refresh')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('name', 'UnauthorizedException');
    });
  });
});