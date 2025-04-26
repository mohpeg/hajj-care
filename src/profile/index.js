const { Router } = require('express');
const router = Router();
const requireAuth = require('../middlewares/require-auth.middleware.js');
const handleAsync = require('../lib/handle-async.js');
const upload = require('../lib/multer.js');

const {
  getPilgrimProfile,
  addPilgrimContactInfo,
  updatePilgrimContactInfo,
} = require('./controllers/profileController.js');

router.get('/v1/pilgrim/profile', requireAuth, handleAsync(getPilgrimProfile));

router.post(
  '/v1/pilgrim/profile',
  requireAuth,

  upload.single('passportImage'),
  handleAsync(addPilgrimContactInfo)
);
router.patch(
  '/v1/pilgrim/profile',
  requireAuth,

  upload.single('passportImage'),
  handleAsync(updatePilgrimContactInfo)
);

module.exports = router;
