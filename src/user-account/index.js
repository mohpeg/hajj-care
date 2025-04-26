const { Router } = require('express');
const tokenController = require('./controllers/token.controller.js');
const requireAuth = require('../middlewares/require-auth.middleware.js');

const router = Router();

router.post('/v1/token', tokenController.grantToken);

router.delete('/v1/logout',requireAuth ,tokenController.revokeToken);
module.exports = router;
    