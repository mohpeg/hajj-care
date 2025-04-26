const Joi = require('joi');

const pilgrimContactAuthSchema = Joi.object({
  mobileNumber: Joi.string().max(15).optional().allow(null, ''),

  emergencyMobileNumber: Joi.string().max(20).optional().allow(null, ''),

  passportImage: Joi.string().optional().allow(null, ''),

  dateOfBirth: Joi.date().optional().allow(null),

  hotelName: Joi.string().optional().allow(null, ''),

  roomNumber: Joi.string().optional().allow(null, ''),

  passportImage: Joi.string().optional().allow(null, ''),
}).unknown(false);

module.exports = { pilgrimContactAuthSchema };
