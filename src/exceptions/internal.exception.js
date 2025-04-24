class InternalServerException extends Error{
    constructor(message = 'Internal Server Error'){
        super(message);
        this.name = 'InternalServerException';
        this.statusCode = 500;
    }
}

module.exports ={ InternalServerException};