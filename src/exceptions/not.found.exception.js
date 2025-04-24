class NotFoundException  extends Error{
  constructor(message = 'user not found or already logged out') {
    super(message);
    this.name = 'Not Found Exception';
    this.statusCode = 404;
  }
}
module.exports = { NotFoundException };
