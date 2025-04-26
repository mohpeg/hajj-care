const jwt = require('jsonwebtoken');
const {
  UnauthorizedException,
} = require('../exceptions/unauthorized.exception');

function requireAuth(req, res, next) {
  const access_token = (req.headers['authorization'] || '').replace(
    'Bearer ',
    ''
  );

  if (!access_token) {
    return res
      .status(401)
      .json(new UnauthorizedException('Access token is missing'));
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(new UnauthorizedException('Access token has expired'));
    }
    return res
      .status(401)
      .json(new UnauthorizedException('Access token is invalid'));
  }
}

module.exports = requireAuth;