const { Sequelize } = require('sequelize');
const ExtraMedicalRecordsModel = require('../../../models/extraMedicalRecords');

describe('ExtraMedicalRecords Model', () => {
  let sequelize;
  let MedicalRecord;
  
  beforeEach(() => {
    // Setup in-memory database for testing
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    MedicalRecord = ExtraMedicalRecordsModel(sequelize, Sequelize.DataTypes);
    
    // Create a mock for PilgrimsData model for association testing
    const mockPilgrimsData = {
      name: 'PilgrimsData'
    };
    
    // Setup models object for association testing
    MedicalRecord.sequelize = {
      models: {
        PilgrimsData: mockPilgrimsData
      }
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    sequelize.close();
  });

  test('should define the MedicalRecord model with correct table name', () => {
    expect(MedicalRecord.tableName).toBe('extra_medical_records');
  });

  test('should define the hajjId as primary key with correct properties', () => {
    const hajjIdField = MedicalRecord.tableAttributes.hajjId;
    expect(hajjIdField).toBeDefined();
    expect(hajjIdField.field).toBe('hajj_id');
    expect(hajjIdField.allowNull).toBe(false);
    expect(hajjIdField.references).toBeDefined();
    expect(hajjIdField.references.model).toBe('pilgrims_data');
    expect(hajjIdField.references.key).toBe('hajj_id');
    expect(hajjIdField.onUpdate).toBe('CASCADE');
    expect(hajjIdField.onDelete).toBe('CASCADE');
  });
  
  test('should define health conditions fields correctly', () => {
    // Test chronic conditions fields exist
    expect(MedicalRecord.tableAttributes.has_hypertension).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_diabetes).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_heart_failure).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_kidney_failure).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_cancer).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_coronary_artery_disease).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_liver_cirrhosis).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_brain_bleed_or_stroke).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_paralysis).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_neuro_psych_disorders).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_mouth_bleeding).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_rectal_bleeding).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_gastric_ulcer).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_asthma).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_tuberculosis).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_pulmonary_fibrosis).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_autoimmune_disease).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_chronic_blood_disease).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_other_diseases).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_other_diseases_details).toBeDefined();
    
    // Check types
    expect(MedicalRecord.tableAttributes.has_hypertension.type).toBeInstanceOf(Sequelize.BOOLEAN);
    expect(MedicalRecord.tableAttributes.has_diabetes.type).toBeInstanceOf(Sequelize.BOOLEAN);
    expect(MedicalRecord.tableAttributes.has_other_diseases_details.type).toBeInstanceOf(Sequelize.STRING);
    
    // Check onboarding completion flags
    expect(MedicalRecord.tableAttributes.onboarding_health_conditions_completed).toBeDefined();
    expect(MedicalRecord.tableAttributes.onboarding_health_conditions_completed.type).toBeInstanceOf(Sequelize.BOOLEAN);
  });
  
  test('should define medical procedures fields correctly', () => {
    // Test medical procedures fields exist
    expect(MedicalRecord.tableAttributes.was_hospitalized).toBeDefined();
    expect(MedicalRecord.tableAttributes.was_in_icu).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_surgery).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_kidney_dialysis).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_catheterization).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_chemotherapy_or_radiotherapy).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_gastro_endoscopy).toBeDefined();
    expect(MedicalRecord.tableAttributes.had_other_endoscopy).toBeDefined();
    expect(MedicalRecord.tableAttributes.other_endoscopy_details).toBeDefined();
    expect(MedicalRecord.tableAttributes.other_procedures).toBeDefined();
    expect(MedicalRecord.tableAttributes.other_procedures_details).toBeDefined();
    
    // Check types
    expect(MedicalRecord.tableAttributes.had_surgery.type).toBeInstanceOf(Sequelize.BOOLEAN);
    expect(MedicalRecord.tableAttributes.other_procedures_details.type).toBeInstanceOf(Sequelize.STRING);
    expect(MedicalRecord.tableAttributes.other_endoscopy_details.type).toBeInstanceOf(Sequelize.STRING);
    
    // Check onboarding completion flag
    expect(MedicalRecord.tableAttributes.onboarding_others_completed).toBeDefined();
    expect(MedicalRecord.tableAttributes.onboarding_others_completed.type).toBeInstanceOf(Sequelize.BOOLEAN);
  });
  
  test('should define allergy fields correctly', () => {
    // Test allergy fields exist
    expect(MedicalRecord.tableAttributes.has_drug_allergy).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_food_allergy).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_other_allergy).toBeDefined();
    expect(MedicalRecord.tableAttributes.has_other_allergy_details).toBeDefined();
    
    // Check types
    expect(MedicalRecord.tableAttributes.has_drug_allergy.type).toBeInstanceOf(Sequelize.BOOLEAN);
    expect(MedicalRecord.tableAttributes.has_other_allergy_details.type).toBeInstanceOf(Sequelize.STRING);
    
    // Check onboarding completion flag
    expect(MedicalRecord.tableAttributes.onboarding_allergy_completed).toBeDefined();
    expect(MedicalRecord.tableAttributes.onboarding_allergy_completed.type).toBeInstanceOf(Sequelize.BOOLEAN);
  });
  
  test('should enable timestamps and underscored options', () => {
    expect(MedicalRecord.options.timestamps).toBe(true);
    expect(MedicalRecord.options.underscored).toBe(true);
  });

  test('should correctly define the associate method', () => {
    // Call the associate method
    MedicalRecord.associate(MedicalRecord.sequelize.models);
    
    // Check that the association is correctly defined
    expect(MedicalRecord.belongsTo).toBeDefined();
    
    // Mock the belongsTo function
    MedicalRecord.belongsTo = jest.fn();
    
    // Call associate again with the mock
    MedicalRecord.associate(MedicalRecord.sequelize.models);
    
    // Check that belongsTo was called with correct parameters
    expect(MedicalRecord.belongsTo).toHaveBeenCalledWith(
      MedicalRecord.sequelize.models.PilgrimsData,
      {
        foreignKey: 'hajjId',
        as: 'pilgrim'
      }
    );
  });

  test('should sync with database successfully', async () => {
    await expect(MedicalRecord.sync({ force: true })).resolves.toBe(MedicalRecord);
  });
});