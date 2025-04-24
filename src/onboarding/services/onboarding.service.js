const { ValidationException, NotFoundException } = require('../../exceptions');
const db = require('../../models');
const Joi = require('joi');

const healthConditionsAuthSchema = Joi.object({
  has_hypertension: Joi.boolean().optional(),
  has_diabetes: Joi.boolean().optional(),
  has_heart_failure: Joi.boolean().optional(),
  has_coronary_artery_disease: Joi.boolean().optional(),
  has_liver_cirrhosis: Joi.boolean().optional(),
  has_kidney_failure: Joi.boolean().optional(),
  has_cancer: Joi.boolean().optional(),
  has_brain_bleed_or_stroke: Joi.boolean().optional(),
  has_paralysis: Joi.boolean().optional(),
  has_neuro_psych_disorders: Joi.boolean().optional(),
  has_mouth_bleeding: Joi.boolean().optional(),
  has_rectal_bleeding: Joi.boolean().optional(),
  has_gastric_ulcer: Joi.boolean().optional(),
  has_asthma: Joi.boolean().optional(),
  has_tuberculosis: Joi.boolean().optional(),
  has_pulmonary_fibrosis: Joi.boolean().optional(),
  has_autoimmune_disease: Joi.boolean().optional(),
  has_chronic_blood_disease: Joi.boolean().optional(),
  has_other_diseases: Joi.boolean().optional(),
  has_other_diseases_details: Joi.string().allow(null, '').optional(),
  onboarding_health_conditions_completed: Joi.boolean().optional(),
});

async function addHealthConditions(hajjId, data) {
  const { error } = healthConditionsAuthSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new ValidationException(`Validation error: ${errorMessage}`);
  }

  const existingRecord = await db.MedicalRecord.findOne({
    where: { hajjId },
  });
  if (existingRecord && existingRecord.onboarding_health_conditions_completed) {
    throw new ValidationException(`Health conditions already completed`);
  }

  if (!existingRecord) {
    const result = await db.MedicalRecord.create({
      ...data,
      hajjId,
      onboarding_health_conditions_completed: true,
    });
    return result;
  }

  const updatedRecord = await db.MedicalRecord.update(
    { ...data, onboarding_health_conditions_completed: true },
    { where: { hajjId } }
  );

  return updatedRecord;
}

const medicalProceduresAuthSchema = Joi.object({
  was_hospitalized: Joi.boolean().optional(),
  was_in_icu: Joi.boolean().optional(),
  had_surgery: Joi.boolean().optional(),
  had_catheterization: Joi.boolean().optional(),
  had_kidney_dialysis: Joi.boolean().optional(),
  had_chemotherapy_or_radiotherapy: Joi.boolean().optional(),
  had_gastro_endoscopy: Joi.boolean().optional(),
  had_other_endoscopy: Joi.boolean().optional(),
  other_endoscopy_details: Joi.string().allow(null, '').optional(),
  other_procedures: Joi.boolean().optional(),
  other_procedures_details: Joi.string().allow(null, '').optional(),
  onboarding_others_completed: Joi.boolean().optional(),
});

async function addMedicalProcedures(hajjId, data) {
  const { error } = medicalProceduresAuthSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new ValidationException(`Validation error: ${errorMessage}`);
  }

  const existingRecord = await db.MedicalRecord.findOne({
    where: { hajjId },
  });

  if (existingRecord && existingRecord.onboarding_others_completed) {
    throw new ValidationException(`Medical procedures already completed`);
  }

  if (!existingRecord) {
    const result = await db.MedicalRecord.create({
      ...data,
      hajjId,
      onboarding_others_completed: true,
    });
    return result;
  }
  const updatedRecord = await db.MedicalRecord.update(
    { ...data, onboarding_others_completed: true },
    { where: { hajjId } }
  );

  return updatedRecord;
}

const allergyAuthSchema = Joi.object({
  has_drug_allergy: Joi.boolean().optional(),
  has_food_allergy: Joi.boolean().optional(),
  has_other_allergy: Joi.boolean().optional(),
  other_allergy_details: Joi.string().allow(null, '').optional(),
  onboarding_allergy_completed: Joi.boolean().optional(),
});

async function addAllergy(hajjId, data) {
  const { error } = allergyAuthSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new ValidationException(`Validation error: ${errorMessage}`);
  }

  const existingRecord = await db.MedicalRecord.findOne({
    where: { hajjId },
  });
  if (existingRecord && existingRecord.onboarding_allergy_completed) {
    throw new ValidationException(`Allergy form already completed`);
  }

  if (!existingRecord) {
    const result = await db.MedicalRecord.create({
      ...data,
      hajjId,
      onboarding_allergy_completed: true,
    });
    return result;
  }

  const updatedRecord = await db.MedicalRecord.update(
    { ...data, onboarding_allergy_completed: true },
    { where: { hajjId } }
  );

  return updatedRecord;
}

async function getOnboardingData(hajjId) {
  const existingRecord = await db.MedicalRecord.findOne({
    where: { hajjId },
  });
  if (!existingRecord) {
    throw new NotFoundException(`No avaible record for this user`);
  }
  return existingRecord;
}
module.exports = {
  addHealthConditions,
  addMedicalProcedures,
  addAllergy,
  getOnboardingData,
};
