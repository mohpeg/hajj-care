const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const responseTime = require('response-time');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./docs/swaggerOptions');

const specs = swaggerJsdoc(swaggerOptions);

const tokenRouter = require('./user-account/');
const onboardingRouter = require('./onboarding');
const profileRouter = require('./profile');
const statisticsRouter = require('./statistics');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(responseTime());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(tokenRouter);
app.use(onboardingRouter);
app.use(profileRouter);
app.use(statisticsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    name: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || 500,
  });
});

module.exports = app;
