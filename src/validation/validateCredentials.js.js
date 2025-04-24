// utils/validateCredentials.js
const Joi = require('joi');
const { ValidationException } = require('../exceptions');

const nationalIdSchema = Joi.string()
  .pattern(/^\d{14}$/)
  .messages({
    'string.pattern.base':
      'National ID must be exactly 14 digits and contain only numbers.',
    'string.empty': 'National ID is required.',
  });

const credentialsSchema = Joi.object({
  grant_type: Joi.string()
    .valid(
      'username:password',
      'national_id',
      'passport_number',
      'mobile_number',
      'refresh_token'
    )
    .required(),

  refresh_token: Joi.when('grant_type', {
    is: 'refresh_token',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  username: Joi.when('grant_type', {
    is: 'username:password',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  password: Joi.when('grant_type', {
    is: 'username:password',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  nationalId: Joi.when('grant_type', {
    is: 'national_id',
    then: Joi.string()
      .pattern(/^\d{14}$/)
      .messages({
        'string.pattern.base':
          'National ID must be exactly 14 digits and contain only numbers.',
        'string.empty': 'National ID is required.',
      })
      .required(),
    otherwise: Joi.forbidden(),
  }),

  passportNumber: Joi.when('grant_type', {
    is: 'passport_number',
    then: Joi.string().alphanum().min(6).max(20).required(),
    otherwise: Joi.forbidden(),
  }),

  mobileNumber: Joi.when('grant_type', {
    is: 'mobile_number',
    then: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Mobile number must be 10 to 15 digits.',
      }),
    otherwise: Joi.forbidden(),
  }),
});
/*
  passportNumber: Joi.string().alphanum().min(6).max(20).optional(),
  nationalId: nationalIdSchema.optional(),
*/

// const errorTranslation = {
//   'ar-EG': {
//     'You must provide either passport number or national ID.':
//       'يجب تقديم رقم جواز السفر أو الرقم القومي.',
//     'National ID must be exactly 14 digits.':
//       'يجب أن يتكون الرقم القومي من 14 رقمًا بالضبط.',
//     'Passport number must contain only letters and numbers.':
//       'يجب أن يحتوي رقم جواز السفر على أحرف وأرقام فقط.',
//     'Passport number is too short.': 'رقم جواز السفر قصير جدًا.',
//     'Passport number is too long.': 'رقم جواز السفر طويل جدًا.',
//     'National ID must be exactly 14 digits and contain only numbers.':
//       'يجب أن يتكون الرقم القومي من 14 رقمًا بالضبط ويحتوي على أرقام فقط.',
//   },
//   'en-US': {
//     'You must provide either passport number or national ID.':
//       'You must provide either passport number or national ID.',
//     'National ID must be exactly 14 digits.':
//       'National ID must be exactly 14 digits.',
//     'Passport number must contain only letters and numbers.':
//       'Passport number must contain only letters and numbers.',
//     'Passport number is too short.': 'Passport number is too short.',
//     'Passport number is too long.': 'Passport number is too long.',
//     'National ID must be exactly 14 digits and contain only numbers.':
//       'National ID must be exactly 14 digits and contain only numbers.',
//   },
// };
function validateCredentials(data) {
  // if (data.nationalId.split('').some((ch) => typeof Number(ch) !== 'number')) {
  //   throw new Error('National ID must not have invalid charchters');
  // }

  // let localeId =
  //   req.headers['accept-language'] || req.headers['Accept-Language'] || 'ar-EG';
  // if (errorTranslation[localeId] == null) {
  //   localeId = 'ar-EG';
  // }

  if (!data) {
    throw new ValidationException(`You must pass nationalId or passportNumber`);
  }

  return credentialsSchema.validate(data, { abortEarly: false });
}

module.exports = {
  validateCredentials,
};
