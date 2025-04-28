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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.js'],
};

module.exports = options;
