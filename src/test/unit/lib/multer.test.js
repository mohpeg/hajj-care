const path = require('path');
const fs = require('fs');

// Mock multer before importing our module
jest.mock('multer', () => {
  const mockDiskStorage = jest.fn().mockReturnValue('mockStorageConfig');
  const mockMulter = jest.fn().mockImplementation((options) => {
    mockMulter.lastOptions = options;
    return 'mockMulterMiddleware';
  });
  mockMulter.diskStorage = mockDiskStorage;
  return mockMulter;
});

// Import after mocking
const multer = require('multer');
const multerConfig = require('../../../lib/multer');

describe('Multer configuration', () => {
  beforeEach(() => {
    // Clear any previous mock data
    jest.clearAllMocks();
  });
  
  test('should configure multer with correct options', () => {
    // The multer mock records the options in lastOptions
    const options = multer.lastOptions;

    expect(options).toBeDefined();
    expect(options.storage).toBe('mockStorageConfig');
    expect(options.limits.fileSize).toBe(5 * 1024 * 1024); // 5MB
    expect(typeof options.fileFilter).toBe('function');
  });
  
  test('should configure disk storage with correct destination and filename', () => {
    // Get the storage config passed to diskStorage
    const storageOptions = multer.diskStorage.mock.calls[0][0];
    
    expect(typeof storageOptions.destination).toBe('function');
    expect(typeof storageOptions.filename).toBe('function');
    
    // Test the destination function
    const mockCallback = jest.fn();
    storageOptions.destination({}, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, 'uploads/passports/');
    
    // Test the filename function
    const mockFile = { fieldname: 'passportImage', originalname: 'test.jpg' };
    const mockFilenameCallback = jest.fn();
    storageOptions.filename({}, mockFile, mockFilenameCallback);
    
    expect(mockFilenameCallback).toHaveBeenCalledWith(
      null,
      expect.stringMatching(/passportImage-\d+-\d+\.jpg/)
    );
  });
  
  test('should filter files based on allowed extensions', () => {
    // Get the fileFilter function from the multer config
    const fileFilter = multer.lastOptions.fileFilter;
    
    const mockCallback = jest.fn();
    
    // Test allowed file type: jpg
    const jpgFile = { originalname: 'test.jpg' };
    fileFilter({}, jpgFile, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, true);
    
    // Reset mock
    mockCallback.mockReset();
    
    // Test allowed file type: jpeg
    const jpegFile = { originalname: 'test.jpeg' };
    fileFilter({}, jpegFile, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, true);
    
    // Reset mock
    mockCallback.mockReset();
    
    // Test allowed file type: png
    const pngFile = { originalname: 'test.png' };
    fileFilter({}, pngFile, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, true);
    
    // Reset mock
    mockCallback.mockReset();
    
    // Test disallowed file type: pdf
    const pdfFile = { originalname: 'test.pdf' };
    fileFilter({}, pdfFile, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Only images (jpeg, jpg, png) are allowed' }),
      false
    );
  });
  
  test('should export the configured multer middleware', () => {
    expect(multerConfig).toBe('mockMulterMiddleware');
  });
});