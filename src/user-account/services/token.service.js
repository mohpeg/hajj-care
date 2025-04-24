const bcrypt = require('bcryptjs');
const db = require('../../models');
const {
  validateCredentials,
} = require('../../validation/validateCredentials.js');
const {
  ValidationException,
  UnauthorizedException,
} = require('../../exceptions');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require('../../lib/jwt');

async function handlePassportNumberLogin(passportNumber) {
  const user = await db.UserAccount.findOne({ where: { passportNumber } });
  if (!user) {
    throw new UnauthorizedException('Invalid passport number');
  }

  return user;
}

async function handleNationalIdLogin(nationalId) {
  const user = await db.UserAccount.findOne({ where: { nationalId } });
  if (!user) {
    throw new UnauthorizedException('Invalid national ID');
  }

  return user;
}

async function handleUsernameAndPasswordLogin({ username, password }) {
  const user = await db.UserAccount.findOne({
    where: { username },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid username or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid username or password');
  }

  return user;
}

async function handleRefreshTokenLogin(refreshToken) {
  const payload = verifyToken(refreshToken);
  if (!payload) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const user = await db.UserAccount.findOne({
    where: { id: payload.sub },
  });
  if (!user) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  return user;
}

async function getToken(data) {
  try {
    const { error, value } = validateCredentials(data);

    if (error) {
      throw new ValidationException(error.details[0].message);
    }

    let user = null;
    switch (data.grant_type) {
      case 'username:password': {
        user = await handleUsernameAndPasswordLogin(data);
        break;
      }
      case 'national_id': {
        user = await handleNationalIdLogin(data.nationalId);
        break;
      }
      case 'passport_number': {
        user = await handlePassportNumberLogin(data.passportNumber);
        break;
      }
      case 'refresh_token': {
        user = await handleRefreshTokenLogin(data.refresh_token);
        break;
      }

      default: {
        throw new ValidationException('Unsupported grant_type');
      }
    }

    const access_token = generateAccessToken({
      accountId: user.id,
      role: user.role,
      hajjId: user.hajjId
    });
    const refresh_token = generateRefreshToken({
      accountId: user.id,
    });

    return { access_token, refresh_token };
  } catch (exc) {
    console.error(exc);
    throw exc;
  }
}

module.exports = {
  getToken,
};
