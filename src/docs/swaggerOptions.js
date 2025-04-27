
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hajj Medical App API',
      version: '1.0.0',
      description: 'API documentation for Hajj Medical Application',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

module.exports = options;
