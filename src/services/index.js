const {
  createMedicalRecord,
} = require('./pilgrim.extra.medical.record.creation.service');
const {
  searchAll,
  findById,
  findByPassport,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require('./pilgrim.service');

module.exports = {
  searchAll,
  findById,
  findByPassport,
  updateMedicalRecord,
  deleteMedicalRecord,
  createMedicalRecord,
};
