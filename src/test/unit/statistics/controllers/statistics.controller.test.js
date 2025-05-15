const { getDashboardStatistic } = require('../../../../statistics/controllers/statistics.controller');
const statisticsService = require('../../../../statistics/services/statistics.service');
const { NotFoundException, InternalServerException } = require('../../../../exceptions');

// Mock dependencies
jest.mock('../../../../statistics/services/statistics.service');
// Mock console.error to avoid cluttering test output
console.error = jest.fn();

describe('Statistics Controller', () => {
  // Mock Express request and response
  let mockReq;
  let mockRes;
  
  beforeEach(() => {
    mockReq = {
      params: {},
      user: { id: 1, role: 'admin' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should return dashboard statistics successfully', async () => {
    // Setup
    mockReq.params.dashboardName = 'totalPilgrims';
    const mockStatistics = { total: 1000, breakdown: { male: 600, female: 400 } };
    statisticsService.runQuery.mockResolvedValueOnce(mockStatistics);
    
    // Execute
    await getDashboardStatistic(mockReq, mockRes);
    
    // Assert
    expect(statisticsService.runQuery).toHaveBeenCalledWith('totalPilgrims');
    expect(mockRes.json).toHaveBeenCalledWith(mockStatistics);
    expect(mockRes.status).not.toHaveBeenCalled(); // Default status 200 is used
  });

  test('should return 404 when dashboard is not found', async () => {
    // Setup
    mockReq.params.dashboardName = 'nonExistingDashboard';
    statisticsService.runQuery.mockResolvedValueOnce(null);
    
    // Execute
    await getDashboardStatistic(mockReq, mockRes);
    
    // Assert
    expect(statisticsService.runQuery).toHaveBeenCalledWith('nonExistingDashboard');
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Dashboard not found'
      })
    );
  });

  test('should handle service errors and return 500', async () => {
    // Setup
    mockReq.params.dashboardName = 'errorDashboard';
    const mockError = new Error('Database connection error');
    statisticsService.runQuery.mockRejectedValueOnce(mockError);
    
    // Execute
    await getDashboardStatistic(mockReq, mockRes);
    
    // Assert
    expect(statisticsService.runQuery).toHaveBeenCalledWith('errorDashboard');
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Internal Server Error'
      })
    );
  });

  test('should pass different dashboard names correctly to the service', async () => {
    // Test multiple dashboard types
    const dashboardTypes = [
      'totalCategories',
      'totalCountries',
      'pilgrimDistributionByNationality',
      'mostCommonDiagnoses'
    ];
    
    // Create mock results for each dashboard
    const mockResults = {
      totalCategories: { count: 12 },
      totalCountries: { count: 45 },
      pilgrimDistributionByNationality: { data: [{ country: 'Egypt', count: 250 }] },
      mostCommonDiagnoses: { data: [{ diagnosis: 'Hypertension', count: 120 }] }
    };
    
    // Test each dashboard type
    for (const dashboardName of dashboardTypes) {
      // Reset mocks
      jest.clearAllMocks();
      
      // Setup
      mockReq.params.dashboardName = dashboardName;
      statisticsService.runQuery.mockResolvedValueOnce(mockResults[dashboardName]);
      
      // Execute
      await getDashboardStatistic(mockReq, mockRes);
      
      // Assert
      expect(statisticsService.runQuery).toHaveBeenCalledWith(dashboardName);
      expect(mockRes.json).toHaveBeenCalledWith(mockResults[dashboardName]);
    }
  });
});