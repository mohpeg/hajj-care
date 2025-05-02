const { ROLES } = require('../constants/roles');

function requireRoles(requiredRoles) {
  return function (req, res, next) {
    const systemRoles = Object.values(ROLES);
    for (const requiredRole of requiredRoles) {
      const roleExists = systemRoles.includes(requiredRole);
      if (!roleExists) {
        console.error(new Error(`Invalid role: ${requiredRole}`));
        return res.status(500).json({
          message: 'Internal Server Error',
        });
      }
    }

    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    if (!req.user.role) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userRole = req.user.role;
    for (const requiredRole of requiredRoles) {
      if (userRole == requiredRole) {
        return next();
      }
    }

    return res.status(403).json({
      message: 'Forbidden',
    });
  };
}

module.exports = requireRoles;
