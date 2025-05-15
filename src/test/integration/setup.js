const supertest = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

// Helper function to create test tokens
function createTestTokens() {
  const payload = {
    userId: 999,
    role: 'test-role',
    hajjId: 'test-hajj-id'
  };
  
  const access_token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
  
  const refresh_token = jwt.sign(
    { ...payload, tokenType: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { access_token, refresh_token };
}

// Export the request object, app, and helper function
module.exports = {
  request: supertest,
  app,
  createTestTokens
};