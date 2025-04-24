const { Router } = require('express');
const tokenController = require('./controllers/token.controller.js');

const router = Router();

router.post('/v1/token', tokenController.grantToken);

module.exports = router;
