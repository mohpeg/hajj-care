class ValidationException extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationExeption';
    this.statusCode = 400;
  }
}

module.exports = {ValidationException};
