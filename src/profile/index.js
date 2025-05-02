const { Router } = require('express');
const router = Router();
const requireAuth = require('../middlewares/require-auth.middleware.js');
const requireRoles = require('../middlewares/require-role.js');
const { ROLES } = require('../constants/roles.js');
const handleAsync = require('../lib/handle-async.js');
const upload = require('../lib/multer.js');

const {
  getPilgrimProfile,
  addPilgrimContactInfo,
  updatePilgrimContactInfo,
  getAllPilgrimProfiles,
} = require('./controllers/profileController.js');

/**
 * @swagger
 * /v1/pilgrim/profile:
 *   get:
 *     summary: Retrieve pilgrim profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved pilgrim profile
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Pilgrim not found
 */

router.get('/v1/pilgrim/profile', requireAuth, handleAsync(getPilgrimProfile));

/**
 * @swagger
 * /v1/pilgrim/profile:
 *   post:
 *     summary: Add new pilgrim contact information with optional passport image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               passportImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload passport image
 *               hotelName:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               primaryMobileNumber:
 *                 type: string
 *               emergencyMobileNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created pilgrim contact info
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/v1/pilgrim/profile',
  requireAuth,

  upload.single('passportImage'),
  handleAsync(addPilgrimContactInfo)
);

/**
 * @swagger
 * /v1/pilgrim/profile:
 *   patch:
 *     summary: Update pilgrim contact information with optional passport image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               passportImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload new passport image (optional)
 *               hotelName:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               primaryMobileNumber:
 *                 type: string
 *               emergencyMobileNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated pilgrim contact info
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/v1/pilgrim/profile',
  requireAuth,

  upload.single('passportImage'),
  handleAsync(updatePilgrimContactInfo)
);

/**
 * @swagger
 * /v1/pilgrim/profile/list:
 *   get:
 *     summary: Retrieve a list of all pilgrim profiles
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of pilgrim profiles
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 */

router.get(
  '/v1/pilgrim/profile/list',
  requireAuth,
  requireRoles([ROLES.ADMIN]),
  handleAsync(getAllPilgrimProfiles)
);

module.exports = router;
