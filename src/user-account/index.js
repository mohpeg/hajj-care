const { Router } = require('express');
const tokenController = require('./controllers/token.controller.js');
const requireAuth = require('../middlewares/require-auth.middleware.js');

const router = Router();
/**
 * @swagger
 * /v1/token:
 *   post:
 *     summary: Generate new access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grant_type:
 *                 type: string
 *                 enum: [username:password, passport_number, national_id, refresh_token]
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               nationalId:
 *                 type: string
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens generated successfully
 *       400:
 *         description: Validation error (invalid credentials or grant type)
 *       401:
 *         description: Unauthorized (wrong credentials)
 */

router.post('/v1/token', tokenController.grantToken);

/**
 * @swagger
 * /v1/logout:
 *   delete:
 *     summary: Logout and revoke refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to be revoked
 *     responses:
 *       200:
 *         description: Logout successful, refresh token revoked
 *       400:
 *         description: Refresh token is missing
 *       401:
 *         description: Refresh token is invalid or already revoked
 */

router.delete('/v1/logout', requireAuth, tokenController.revokeToken);
module.exports = router;
