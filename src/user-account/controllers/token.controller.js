const tokenService = require('../services/token.service.js');

async function grantToken(req, res) {
  const result = await tokenService.getToken(req.body);
  res.status(200).json(result);
}

module.exports = {
  grantToken,
};
