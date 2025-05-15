module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/test/setup/jest.setup.js'],
  testMatch: [
    '<rootDir>/src/test/**/*.test.js'
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/seeders/**',
    '!src/migrations/**',
    '!src/docs/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json'],
  clearMocks: true,
  testTimeout: 10000
};