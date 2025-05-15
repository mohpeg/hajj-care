const {
  addHealthConditions,
  addMedicalProcedures,
  addAllergy,
  getOnboardingData,
  getPaginatedData
} = require('../../../../onboarding/services/onboarding.service');
const { ValidationException, NotFoundException } = require('../../../../exceptions');
const db = require('../../../../models');

jest.mock('../../../../models', () => ({
  MedicalRecord: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAndCountAll: jest.fn()
  }
}));

describe('Onboarding Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addHealthConditions', () => {
    const mockHajjId = 'hajj123';
    const mockHealthData = {
      has_hypertension: true,
      has_diabetes: false,
      has_heart_failure: false
    };

    test('should create new health conditions record if none exists', async () => {
      // Mock findOne to return null (record doesn't exist)
      db.MedicalRecord.findOne.mockResolvedValue(null);
      
      // Mock create to return created data
      const mockCreatedData = { id: 1, ...mockHealthData, hajjId: mockHajjId };
      db.MedicalRecord.create.mockResolvedValue(mockCreatedData);

      const result = await addHealthConditions(mockHajjId, mockHealthData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.create).toHaveBeenCalledWith({
        ...mockHealthData,
        hajjId: mockHajjId,
        onboarding_health_conditions_completed: true
      });
      expect(result).toEqual(mockCreatedData);
    });

    test('should update health conditions if record exists', async () => {
      // Mock findOne to return existing record
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_health_conditions_completed: false 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      // Mock update to return updated rows count
      db.MedicalRecord.update.mockResolvedValue([1]);

      const result = await addHealthConditions(mockHajjId, mockHealthData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.update).toHaveBeenCalledWith(
        { 
          ...mockHealthData, 
          onboarding_health_conditions_completed: true 
        },
        { where: { hajjId: mockHajjId } }
      );
      expect(result).toEqual([1]);
    });

    test('should throw ValidationException if health conditions already completed', async () => {
      // Mock findOne to return existing record with completed status
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_health_conditions_completed: true 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      await expect(addHealthConditions(mockHajjId, mockHealthData))
        .rejects
        .toThrow(ValidationException);
    });

    test('should throw ValidationException with invalid data', async () => {
      const invalidData = {
        has_hypertension: 'not-a-boolean'
      };
      
      await expect(addHealthConditions(mockHajjId, invalidData))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('addMedicalProcedures', () => {
    const mockHajjId = 'hajj123';
    const mockProceduresData = {
      was_hospitalized: true,
      was_in_icu: false,
      had_surgery: true
    };

    test('should create new medical procedures record if none exists', async () => {
      db.MedicalRecord.findOne.mockResolvedValue(null);
      
      const mockCreatedData = { id: 1, ...mockProceduresData, hajjId: mockHajjId };
      db.MedicalRecord.create.mockResolvedValue(mockCreatedData);

      const result = await addMedicalProcedures(mockHajjId, mockProceduresData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.create).toHaveBeenCalledWith({
        ...mockProceduresData,
        hajjId: mockHajjId,
        onboarding_others_completed: true
      });
      expect(result).toEqual(mockCreatedData);
    });

    test('should update medical procedures if record exists', async () => {
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_others_completed: false 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      db.MedicalRecord.update.mockResolvedValue([1]);

      const result = await addMedicalProcedures(mockHajjId, mockProceduresData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.update).toHaveBeenCalledWith(
        { 
          ...mockProceduresData, 
          onboarding_others_completed: true 
        },
        { where: { hajjId: mockHajjId } }
      );
      expect(result).toEqual([1]);
    });

    test('should throw ValidationException if medical procedures already completed', async () => {
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_others_completed: true 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      await expect(addMedicalProcedures(mockHajjId, mockProceduresData))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('addAllergy', () => {
    const mockHajjId = 'hajj123';
    const mockAllergyData = {
      has_drug_allergy: true,
      has_food_allergy: true,
      has_other_allergy: false
    };

    test('should create new allergy record if none exists', async () => {
      db.MedicalRecord.findOne.mockResolvedValue(null);
      
      const mockCreatedData = { id: 1, ...mockAllergyData, hajjId: mockHajjId };
      db.MedicalRecord.create.mockResolvedValue(mockCreatedData);

      const result = await addAllergy(mockHajjId, mockAllergyData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.create).toHaveBeenCalledWith({
        ...mockAllergyData,
        hajjId: mockHajjId,
        onboarding_allergy_completed: true
      });
      expect(result).toEqual(mockCreatedData);
    });

    test('should update allergy data if record exists', async () => {
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_allergy_completed: false 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      db.MedicalRecord.update.mockResolvedValue([1]);

      const result = await addAllergy(mockHajjId, mockAllergyData);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(db.MedicalRecord.update).toHaveBeenCalledWith(
        { 
          ...mockAllergyData, 
          onboarding_allergy_completed: true 
        },
        { where: { hajjId: mockHajjId } }
      );
      expect(result).toEqual([1]);
    });

    test('should throw ValidationException if allergy form already completed', async () => {
      const mockExistingRecord = { 
        id: 1, 
        hajjId: mockHajjId, 
        onboarding_allergy_completed: true 
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockExistingRecord);
      
      await expect(addAllergy(mockHajjId, mockAllergyData))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('getOnboardingData', () => {
    const mockHajjId = 'hajj123';

    test('should return onboarding data for user', async () => {
      const mockRecord = { 
        id: 1, 
        hajjId: mockHajjId,
        has_hypertension: true,
        has_drug_allergy: false
      };
      db.MedicalRecord.findOne.mockResolvedValue(mockRecord);

      const result = await getOnboardingData(mockHajjId);
      
      expect(db.MedicalRecord.findOne).toHaveBeenCalledWith({ where: { hajjId: mockHajjId } });
      expect(result).toEqual(mockRecord);
    });

    test('should throw NotFoundException if no record exists', async () => {
      db.MedicalRecord.findOne.mockResolvedValue(null);

      await expect(getOnboardingData(mockHajjId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getPaginatedData', () => {
    test('should return paginated data with default parameters', async () => {
      const mockData = {
        count: 20,
        rows: Array(10).fill().map((_, i) => ({ id: i + 1, hajjId: `hajj${i+1}` }))
      };
      db.MedicalRecord.findAndCountAll.mockResolvedValue(mockData);

      const result = await getPaginatedData();
      
      expect(db.MedicalRecord.findAndCountAll).toHaveBeenCalledWith({
        limit: expect.any(Number),
        offset: expect.any(Number),
        order: [['createdAt', expect.any(String)]]
      });
      expect(result).toEqual({
        currentPage: expect.any(Number),
        totalPages: expect.any(Number),
        totalRecords: 20,
        data: mockData.rows
      });
    });

    test('should return paginated data with custom parameters', async () => {
      const mockData = {
        count: 50,
        rows: Array(5).fill().map((_, i) => ({ id: i + 11, hajjId: `hajj${i+11}` }))
      };
      db.MedicalRecord.findAndCountAll.mockResolvedValue(mockData);

      const result = await getPaginatedData(3, 5, 'ASC');
      
      expect(db.MedicalRecord.findAndCountAll).toHaveBeenCalledWith({
        limit: 5,
        offset: 10,
        order: [['createdAt', 'ASC']]
      });
      expect(result).toEqual({
        currentPage: 3,
        totalPages: 10, // 50/5 = 10
        totalRecords: 50,
        data: mockData.rows
      });
    });
  });
});