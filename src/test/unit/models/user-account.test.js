const { Sequelize } = require('sequelize');
const UserAccountModel = require('../../../models/user-account');

describe('UserAccount Model', () => {
  let sequelize;
  let UserAccount;
  
  beforeEach(() => {
    // Setup in-memory database for testing
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    UserAccount = UserAccountModel(sequelize, Sequelize.DataTypes);
    
    // Create mocks for related models
    const mockPilgrimsData = {
      name: 'PilgrimsData',
    };
    
    const mockMedicalRecord = {
      name: 'MedicalRecord',
    };
    
    // Setup models object for association testing
    UserAccount.sequelize = {
      models: {
        PilgrimsData: mockPilgrimsData,
        MedicalRecord: mockMedicalRecord
      }
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    sequelize.close();
  });

  test('should define the UserAccount model with correct table name', () => {
    expect(UserAccount.tableName).toBe('user_accounts');
  });

  test('should define the id as primary key with correct properties', () => {
    const idField = UserAccount.tableAttributes.id;
    expect(idField).toBeDefined();
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
    expect(idField.allowNull).toBe(false);
    expect(idField.type).toBeInstanceOf(Sequelize.INTEGER);
  });
  
  test('should define hajjId field correctly', () => {
    const hajjIdField = UserAccount.tableAttributes.hajjId;
    expect(hajjIdField).toBeDefined();
    expect(hajjIdField.field).toBe('hajj_id');
    expect(hajjIdField.allowNull).toBe(true);
    expect(hajjIdField.type).toBeInstanceOf(Sequelize.INTEGER);
  });
  
  test('should define name fields correctly', () => {
    expect(UserAccount.tableAttributes.firstName).toBeDefined();
    expect(UserAccount.tableAttributes.firstName.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.firstName.allowNull).toBe(true);
    
    expect(UserAccount.tableAttributes.middleName).toBeDefined();
    expect(UserAccount.tableAttributes.middleName.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.middleName.allowNull).toBe(true);
    
    expect(UserAccount.tableAttributes.lastName).toBeDefined();
    expect(UserAccount.tableAttributes.lastName.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.lastName.allowNull).toBe(true);
  });
  
  test('should define identification fields correctly', () => {
    expect(UserAccount.tableAttributes.passportNumber).toBeDefined();
    expect(UserAccount.tableAttributes.passportNumber.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.passportNumber.unique).toBe(true);
    
    expect(UserAccount.tableAttributes.nationalId).toBeDefined();
    expect(UserAccount.tableAttributes.nationalId.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.nationalId.unique).toBe(true);
  });
  
  test('should define role field correctly with enum values', () => {
    const roleField = UserAccount.tableAttributes.role;
    expect(roleField).toBeDefined();
    expect(roleField.type).toBeInstanceOf(Sequelize.ENUM);
    expect(roleField.values).toEqual(['admin', 'doctor', 'moderator', 'pilgrim']);
    expect(roleField.defaultValue).toBe('pilgrim');
    expect(roleField.allowNull).toBe(false);
  });
  
  test('should define authentication fields correctly', () => {
    expect(UserAccount.tableAttributes.username).toBeDefined();
    expect(UserAccount.tableAttributes.username.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.username.unique).toBe(true);
    
    expect(UserAccount.tableAttributes.hashedPassword).toBeDefined();
    expect(UserAccount.tableAttributes.hashedPassword.type).toBeInstanceOf(Sequelize.STRING);
  });
  
  test('should define contact fields correctly', () => {
    expect(UserAccount.tableAttributes.mobileNumber).toBeDefined();
    expect(UserAccount.tableAttributes.mobileNumber.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.mobileNumber.unique).toBe(true);
    
    expect(UserAccount.tableAttributes.emergencyMobileNumber).toBeDefined();
    expect(UserAccount.tableAttributes.emergencyMobileNumber.type).toBeInstanceOf(Sequelize.STRING);
    expect(UserAccount.tableAttributes.emergencyMobileNumber.unique).toBe(false);
  });
  
  test('should define accommodation fields correctly', () => {
    expect(UserAccount.tableAttributes.hotelName).toBeDefined();
    expect(UserAccount.tableAttributes.hotelName.type).toBeInstanceOf(Sequelize.STRING);
    
    expect(UserAccount.tableAttributes.roomNumber).toBeDefined();
    expect(UserAccount.tableAttributes.roomNumber.type).toBeInstanceOf(Sequelize.STRING);
  });
  
  test('should define other fields correctly', () => {
    expect(UserAccount.tableAttributes.passportImage).toBeDefined();
    expect(UserAccount.tableAttributes.passportImage.type).toBeInstanceOf(Sequelize.STRING);
    
    expect(UserAccount.tableAttributes.dateOfBirth).toBeDefined();
    expect(UserAccount.tableAttributes.dateOfBirth.type).toBeInstanceOf(Sequelize.DATEONLY);
  });
  
  test('should enable timestamps', () => {
    expect(UserAccount.options.timestamps).toBe(true);
    expect(UserAccount.tableAttributes.createdAt).toBeDefined();
    expect(UserAccount.tableAttributes.updatedAt).toBeDefined();
  });

  test('should correctly define the associate method', () => {
    // Mock the association methods
    UserAccount.belongsTo = jest.fn();
    UserAccount.hasOne = jest.fn();
    
    // Call associate
    UserAccount.associate(UserAccount.sequelize.models);
    
    // Check that belongsTo was called with correct parameters
    expect(UserAccount.belongsTo).toHaveBeenCalledWith(
      UserAccount.sequelize.models.PilgrimsData,
      {
        foreignKey: 'hajjId',
        targetKey: 'hajjId',
        as: 'pilgrim'
      }
    );
    
    // Check that hasOne was called with correct parameters
    expect(UserAccount.hasOne).toHaveBeenCalledWith(
      UserAccount.sequelize.models.MedicalRecord,
      {
        foreignKey: 'hajjId',
        sourceKey: 'hajjId',
        as: 'medicalRecords'
      }
    );
  });

  test('should sync with database successfully', async () => {
    await expect(UserAccount.sync({ force: true })).resolves.toBe(UserAccount);
  });
});