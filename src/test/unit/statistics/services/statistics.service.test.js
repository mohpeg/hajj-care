const { runQuery } = require('../../../../statistics/services/statistics.service');
const db = require('../../../../models');
const { QueryTypes } = require('sequelize');

jest.mock('../../../../models', () => ({
  sequelize: {
    query: jest.fn()
  }
}));

describe('Statistics Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runQuery', () => {
    test('should execute totalCategories query successfully', async () => {
      const mockResult = [{ TotalCategories: 10 }];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('totalCategories');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) AS TotalCategories FROM Category'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });

    test('should execute totalPilgrims query successfully', async () => {
      const mockResult = [{ TotalPilgrims: 5000 }];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('totalPilgrims');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) AS TotalPilgrims FROM pilgrims_data'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });

    test('should execute chronicDiseasePrevalence query successfully', async () => {
      const mockResult = [{
        HypertensionCount: 500,
        DiabetesCount: 300,
        CancerCount: 50
      }];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('chronicDiseasePrevalence');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('has_hypertension'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });

    test('should execute pilgrimDistributionByNationality query successfully', async () => {
      const mockResult = [
        { country_Nationality: 'Egypt', PilgrimCount: 1000 },
        { country_Nationality: 'Saudi Arabia', PilgrimCount: 800 },
        { country_Nationality: 'Indonesia', PilgrimCount: 600 }
      ];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('pilgrimDistributionByNationality');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('country_Nationality'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });

    test('should return null for non-existent dashboard', async () => {
      const result = await runQuery('nonExistentDashboard');
      
      expect(db.sequelize.query).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('should handle query execution error', async () => {
      const errorMessage = 'Database connection error';
      db.sequelize.query.mockRejectedValue(new Error(errorMessage));

      await expect(runQuery('totalPilgrims')).rejects.toThrow(errorMessage);
      
      expect(db.sequelize.query).toHaveBeenCalled();
    });
    
    test('should execute mostCommonDiagnoses query successfully', async () => {
      const mockResult = [
        { cv_diagnosis_id: 101, DiagnosisCount: 150 },
        { cv_diagnosis_id: 202, DiagnosisCount: 120 },
        { cv_diagnosis_id: 303, DiagnosisCount: 90 }
      ];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('mostCommonDiagnoses');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('cv_diagnosis_id'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });
    
    test('should execute totalDeathCases query successfully', async () => {
      const mockResult = [{ TotalDeathCases: 25 }];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('totalDeathCases');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) AS TotalDeathCases FROM death_cases'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });
    
    test('should execute allergiesReported query successfully', async () => {
      const mockResult = [{
        DrugAllergyCount: 320,
        FoodAllergyCount: 280
      }];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('allergiesReported');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('has_drug_allergy'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });
    
    test('should execute userRolesDistribution query successfully', async () => {
      const mockResult = [
        { role: 'admin', RoleCount: 5 },
        { role: 'doctor', RoleCount: 50 },
        { role: 'pilgrim', RoleCount: 5000 }
      ];
      db.sequelize.query.mockResolvedValue(mockResult);

      const result = await runQuery('userRolesDistribution');
      
      expect(db.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('role'),
        { type: QueryTypes.SELECT }
      );
      expect(result).toEqual(mockResult);
    });
  });
});