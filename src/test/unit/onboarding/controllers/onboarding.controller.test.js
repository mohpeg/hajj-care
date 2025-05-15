const onboardingController = require('../../../../onboarding/controllers/onboarding.controller');
const onboardingService = require('../../../../onboarding/services/onboarding.service');
const { ValidationException, NotFoundException } = require('../../../../exceptions');

jest.mock('../../../../onboarding/services/onboarding.service');

describe('Onboarding Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: { hajjId: 'hajj123' },
      body: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addHealthConditions', () => {
    test('should add health conditions successfully', async () => {
      const mockData = {
        has_hypertension: true,
        has_diabetes: false
      };
      req.body = mockData;
      
      const mockResult = { id: 1, ...mockData, hajjId: 'hajj123' };
      onboardingService.addHealthConditions.mockResolvedValue(mockResult);

      await onboardingController.addHealthConditions(req, res);
      
      expect(onboardingService.addHealthConditions).toHaveBeenCalledWith('hajj123', mockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test('should handle service errors', async () => {
      const errorMessage = 'Validation failed';
      onboardingService.addHealthConditions.mockRejectedValue(new Error(errorMessage));
      
      await expect(onboardingController.addHealthConditions(req, res)).rejects.toThrow();
    });
  });

  describe('addMedicalProcedures', () => {
    test('should add medical procedures successfully', async () => {
      const mockData = {
        was_hospitalized: true,
        had_surgery: false
      };
      req.body = mockData;
      
      const mockResult = { id: 1, ...mockData, hajjId: 'hajj123' };
      onboardingService.addMedicalProcedures.mockResolvedValue(mockResult);

      await onboardingController.addMedicalProcedures(req, res);
      
      expect(onboardingService.addMedicalProcedures).toHaveBeenCalledWith('hajj123', mockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('addAllergy', () => {
    test('should add allergy information successfully', async () => {
      const mockData = {
        has_drug_allergy: true,
        has_food_allergy: false
      };
      req.body = mockData;
      
      const mockResult = { id: 1, ...mockData, hajjId: 'hajj123' };
      onboardingService.addAllergy.mockResolvedValue(mockResult);

      await onboardingController.addAllergy(req, res);
      
      expect(onboardingService.addAllergy).toHaveBeenCalledWith('hajj123', mockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getOnboardingData', () => {
    test('should return onboarding data successfully', async () => {
      const mockResult = { 
        id: 1, 
        hajjId: 'hajj123',
        has_hypertension: true,
        has_drug_allergy: false
      };
      onboardingService.getOnboardingData.mockResolvedValue(mockResult);

      await onboardingController.getOnboardingData(req, res);
      
      expect(onboardingService.getOnboardingData).toHaveBeenCalledWith('hajj123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test('should handle not found error', async () => {
      onboardingService.getOnboardingData.mockRejectedValue(new NotFoundException('No record found'));
      
      await expect(onboardingController.getOnboardingData(req, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllOnboardingData', () => {
    test('should return paginated data with default parameters', async () => {
      const mockResult = {
        currentPage: 1,
        totalPages: 5,
        totalRecords: 50,
        data: Array(10).fill().map((_, i) => ({ id: i + 1, hajjId: `hajj${i+1}` }))
      };
      onboardingService.getPaginatedData.mockResolvedValue(mockResult);

      await onboardingController.getAllOnboardingData(req, res);
      
      expect(onboardingService.getPaginatedData).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test('should pass query parameters to service', async () => {
      req.query = {
        pageIndex: 2,
        pageSize: 20,
        order: 'DESC'
      };
      
      const mockResult = {
        currentPage: 2,
        totalPages: 3,
        totalRecords: 50,
        data: Array(20).fill().map((_, i) => ({ id: i + 21, hajjId: `hajj${i+21}` }))
      };
      onboardingService.getPaginatedData.mockResolvedValue(mockResult);

      await onboardingController.getAllOnboardingData(req, res);
      
      expect(onboardingService.getPaginatedData).toHaveBeenCalledWith(2, 20, 'DESC');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});