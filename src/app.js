const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const responseTime = require('response-time');
const tokenRouter = require('./user-account/');
const onboardingRouter = require('./onboarding');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(responseTime());

app.use(tokenRouter);
app.use(onboardingRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});

module.exports = app;
