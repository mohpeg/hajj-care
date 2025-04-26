const jwt = require('jsonwebtoken');
const {
  UnauthorizedException,
} = require('../exceptions/unauthorized.exception');
function generateAccessToken({ accountId, role, hajjId }) {
  return jwt.sign({ sub: accountId, hajjId, role }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
}

function generateRefreshToken({ accountId }) {
  return jwt.sign(
    { sub: accountId, typ: 'refresh_token' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedException('Invalid token');
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
