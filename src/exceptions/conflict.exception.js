class ConflictException extends Error {
    constructor(message = 'Conflict occurred') {
        super(message);
        this.name = 'ConflictException';
        this.statusCode = 409;
    }
}

module.exports = {ConflictException};