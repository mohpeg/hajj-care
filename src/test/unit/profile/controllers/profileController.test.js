const profileController = require('../../../../profile/controllers/profileController');
const profileService = require('../../../../profile/services/profileService');
const { UnauthorizedException, NotFoundException } = require('../../../../exceptions');

jest.mock('../../../../profile/services/profileService');

describe('Profile Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: { hajjId: 'hajj123' },
      body: {},
      file: null,
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

  describe('getPilgrimProfile', () => {
    test('should return pilgrim profile successfully', async () => {
      const mockPilgrim = {
        hajjId: 'hajj123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      profileService.findPilgrim.mockResolvedValue(mockPilgrim);
      profileService.setPilgrimDTO.mockReturnValue({
        hajjId: 'hajj123',
        firstName: 'John',
        lastName: 'Doe'
      });

      await profileController.getPilgrimProfile(req, res);
      
      expect(profileService.findPilgrim).toHaveBeenCalledWith('hajj123');
      expect(profileService.setPilgrimDTO).toHaveBeenCalledWith(mockPilgrim);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          hajjId: 'hajj123',
          firstName: 'John',
          lastName: 'Doe'
        })
      });
    });

    test('should return 401 when user is not authenticated', async () => {
      req.user = null;

      await profileController.getPilgrimProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    });

    test('should return 404 when pilgrim is not found', async () => {
      profileService.findPilgrim.mockResolvedValue(null);

      await profileController.getPilgrimProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.any(NotFoundException));
    });
  });

  describe('addPilgrimContactInfo', () => {
    test('should add pilgrim contact info successfully', async () => {
      const mockContactData = {
        mobileNumber: '123456789',
        emergencyMobileNumber: '987654321'
      };
      req.body = mockContactData;
      
      const mockCreatedRecord = {
        hajjId: 'hajj123',
        ...mockContactData
      };
      profileService.savePilgrimContactInfo.mockResolvedValue(mockCreatedRecord);

      await profileController.addPilgrimContactInfo(req, res);
      
      expect(profileService.savePilgrimContactInfo).toHaveBeenCalledWith('hajj123', mockContactData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        operation: 'created',
        data: mockCreatedRecord
      });
    });

    test('should handle file uploads', async () => {
      const mockContactData = {
        mobileNumber: '123456789'
      };
      req.body = mockContactData;
      req.file = { path: '/uploads/passport.jpg' };
      
      const mockExpectedData = {
        ...mockContactData,
        passportImage: '/uploads/passport.jpg'
      };
      
      const mockCreatedRecord = {
        hajjId: 'hajj123',
        ...mockExpectedData
      };
      profileService.savePilgrimContactInfo.mockResolvedValue(mockCreatedRecord);

      await profileController.addPilgrimContactInfo(req, res);
      
      expect(profileService.savePilgrimContactInfo).toHaveBeenCalledWith('hajj123', mockExpectedData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        operation: 'created',
        data: mockCreatedRecord
      });
    });

    test('should return 401 when user is not authenticated', async () => {
      req.user = null;

      await profileController.addPilgrimContactInfo(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(profileService.savePilgrimContactInfo).not.toHaveBeenCalled();
    });
  });

  describe('updatePilgrimContactInfo', () => {
    test('should update pilgrim contact info successfully', async () => {
      const mockContactData = {
        mobileNumber: '123456789',
        emergencyMobileNumber: '987654321'
      };
      req.body = mockContactData;
      
      const mockUpdatedRecord = {
        hajjId: 'hajj123',
        ...mockContactData
      };
      profileService.savePilgrimContactInfo.mockResolvedValue(mockUpdatedRecord);

      await profileController.updatePilgrimContactInfo(req, res);
      
      expect(profileService.savePilgrimContactInfo).toHaveBeenCalledWith('hajj123', mockContactData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        operation: 'updated',
        data: mockUpdatedRecord
      });
    });

    test('should handle file uploads during update', async () => {
      const mockContactData = {
        mobileNumber: '123456789'
      };
      req.body = mockContactData;
      req.file = { path: '/uploads/passport-updated.jpg' };
      
      const mockExpectedData = {
        ...mockContactData,
        passportImage: '/uploads/passport-updated.jpg'
      };
      
      const mockUpdatedRecord = {
        hajjId: 'hajj123',
        ...mockExpectedData
      };
      profileService.savePilgrimContactInfo.mockResolvedValue(mockUpdatedRecord);

      await profileController.updatePilgrimContactInfo(req, res);
      
      expect(profileService.savePilgrimContactInfo).toHaveBeenCalledWith('hajj123', mockExpectedData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        operation: 'updated',
        data: mockUpdatedRecord
      });
    });

    test('should return 401 when user is not authenticated', async () => {
      req.user = null;

      await profileController.updatePilgrimContactInfo(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(profileService.savePilgrimContactInfo).not.toHaveBeenCalled();
    });
  });

  describe('getAllPilgrimProfiles', () => {
    test('should return all pilgrim profiles with default parameters', async () => {
      const mockResult = {
        currentPage: 1,
        totalPages: 5,
        totalRecords: 50,
        data: Array(10).fill().map((_, i) => ({ hajjId: `hajj${i+1}` }))
      };
      profileService.getPaginatedData.mockResolvedValue(mockResult);

      await profileController.getAllPilgrimProfiles(req, res);
      
      expect(profileService.getPaginatedData).toHaveBeenCalled();
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
        data: Array(20).fill().map((_, i) => ({ hajjId: `hajj${i+21}` }))
      };
      profileService.getPaginatedData.mockResolvedValue(mockResult);

      await profileController.getAllPilgrimProfiles(req, res);
      
      expect(profileService.getPaginatedData).toHaveBeenCalledWith(2, 20, 'DESC');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});