const { sequelize, Sequelize } = require('../../../models');

describe('Database Connection', () => {
  beforeAll(async () => {
    // Test database connection before running tests
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Should connect to the database successfully', async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true);
    } catch (error) {
      fail('Database connection failed');
    }
  });

  test('Models should be initialized', () => {
    expect(sequelize.models).toBeDefined();
    // Check for key models - adjust based on your actual models
    expect(sequelize.models.UserAccount).toBeDefined();
    expect(sequelize.models.PilgrimsData).toBeDefined();
    expect(sequelize.models.MedicalRecord).toBeDefined();
  });
});