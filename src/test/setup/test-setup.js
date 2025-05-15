// Set the Node environment to test
process.env.NODE_ENV = 'test';

// This will ensure that all tests use the test configuration with SQLite
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Set up global Jest setup
jest.setTimeout(30000); // Increase timeout for slower tests

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};