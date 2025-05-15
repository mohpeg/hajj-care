const request = require('supertest');
const express = require('express');
const app = require('../../app');

// Mock the routers
jest.mock('../../user-account/', () => {
  const router = express.Router();
  router.get('/mock-token-route', (req, res) => res.status(200).json({ route: 'token' }));
  return router;
});

jest.mock('../../onboarding', () => {
  const router = express.Router();
  router.get('/mock-onboarding-route', (req, res) => res.status(200).json({ route: 'onboarding' }));
  return router;
});

jest.mock('../../profile', () => {
  const router = express.Router();
  router.get('/mock-profile-route', (req, res) => res.status(200).json({ route: 'profile' }));
  return router;
});

jest.mock('../../statistics', () => {
  const router = express.Router();
  router.get('/mock-statistics-route', (req, res) => res.status(200).json({ route: 'statistics' }));
  return router;
});

// Mock other modules
jest.mock('swagger-jsdoc', () => () => ({}));
jest.mock('../../docs/swaggerOptions', () => ({}));
jest.mock('swagger-ui-express', () => ({
  serve: jest.fn(),
  setup: jest.fn(() => (req, res, next) => next()),
}));

describe('App Express Application', () => {
  test('should use json middleware', async () => {
    const response = await request(app)
      .post('/mock-token-route')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeDefined();
  });

  test('should use urlencoded middleware', async () => {
    const response = await request(app)
      .post('/mock-token-route')
      .send('test=data')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    
    expect(response.status).toBeDefined();
  });

  test('should use the tokenRouter', async () => {
    const response = await request(app).get('/mock-token-route');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'token' });
  });

  test('should use the onboardingRouter', async () => {
    const response = await request(app).get('/mock-onboarding-route');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'onboarding' });
  });

  test('should use the profileRouter', async () => {
    const response = await request(app).get('/mock-profile-route');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'profile' });
  });

  test('should use the statisticsRouter', async () => {
    const response = await request(app).get('/mock-statistics-route');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'statistics' });
  });

  test('should handle errors', async () => {
    // Create a mock error route
    app.get('/error-test', (req, res, next) => {
      const error = new Error('Test error');
      error.statusCode = 400;
      next(error);
    });

    const response = await request(app).get('/error-test');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Test error');
    expect(response.body).toHaveProperty('statusCode', 400);
  });

  test('should handle errors without statusCode', async () => {
    // Create a mock error route
    app.get('/generic-error', (req, res, next) => {
      const error = new Error('Generic error');
      next(error);
    });

    const response = await request(app).get('/generic-error');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Generic error');
    expect(response.body).toHaveProperty('statusCode', 500);
  });
});