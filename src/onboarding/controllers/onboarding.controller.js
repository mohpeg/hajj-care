const onboardingService = require('../services/onboarding.service');

async function addHealthConditions(req, res) {
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
  res.status(200).json(req.user.hajjId, result);
}
async function addAllergy(req, res) {
  const result = await onboardingService.addAllergy(req.user.hajjId, req.body);
  res.status(200).json(result);
}

async function getOnboardingData(req, res) {
  const result = await onboardingService.getOnboardingData(req.user.hajjId);
  res.status(200).json(result);
}

async function getAllOnboardingData(req, res) {
  const { pageIndex, pageSize, order } = req.query;
  const result = await onboardingService.getPaginatedData(
    pageIndex,
    pageSize,
    order
  );
  // let { pageIndex, pageSize, order } = req.query;
  // const result = await onboardingService.getPaginatedData(
  //   (pageIndex = 1),
  //   (pageSize = 10),
  //   (order = 'ASC')
  // );
  res.status(200).json(result);
}

module.exports = {
  addHealthConditions,
  addMedicalProcedures,
  addAllergy,
  getOnboardingData,
  getAllOnboardingData,
};
