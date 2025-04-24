const onboardingService = require('../services/onboarding.service');

async function addHealthConditions(req, res) {
  console.log(req.user)
  const result = await onboardingService.addHealthConditions(
    req.user.hajjId,
    req.body
  );
  res.status(200).json(result);
}

async function addMedicalProcedures(req, res) {
  const result = await onboardingService.addMedicalProcedures(
    req.user.hajjId,
    req.body
  );
  res.status(200).json( req.user.hajjId,result);
}
async function addAllergy(req, res) {
  const result = await onboardingService.addAllergy(req.user.hajjId, req.body);
  res.status(200).json(result);
}

async function getOnboardingData(req,res) {
  const result = await onboardingService.getOnboardingData(req.user.hajjId);
  res.status(200).json(result);
}

module.exports = {
  addHealthConditions,
  addMedicalProcedures,
  addAllergy,
  getOnboardingData,
};
