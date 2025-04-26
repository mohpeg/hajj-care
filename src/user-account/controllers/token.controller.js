const {
  ValidationException,
  UnauthorizedException,
} = require('../../exceptions');
const tokenService = require('../services/token.service.js');
const { redisClient } = require('../../lib/redis.js');
const { verifyToken } = require('../../lib/jwt.js');

async function grantToken(req, res) {
  const result = await tokenService.getToken(req.body);
  res.status(200).json(result);
}

async function revokeToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(400)
      .json(new ValidationException('Refresh token is required'));
  }

  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    console.log('JWT verification error:', error);
    return res.status(401).json(new UnauthorizedException(error.message));
  }

  const tokenStatus = await redisClient.get(refreshToken);
  console.log({ tokenStatus });
  if (tokenStatus === 'revoked') {
    return res
      .status(401)
      .json(new UnauthorizedException('Refresh token is revoked'));
  }
  console.log({ decoded });
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  await redisClient.set(refreshToken, 'revoked', {
    EX: decoded.exp - currentTimeStamp,
  });

  return res.status(200).json({ message: 'Logout successfully' });
}
module.exports = {
  grantToken,
  revokeToken,
};
