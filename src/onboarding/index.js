const { Router } = require('express');
const requireAuth = require('../middlewares/require-auth.middleware');

const onboardingController = require('./controllers/onboarding.controller');
const handleAsync = require('../lib/handle-async');

const router = Router();

router.post(
  '/v1/onboarding/health-conditions',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addHealthConditions)
);

router.post(
  '/v1/onboarding/medical-procedures',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addMedicalProcedures)
);

router.post(
  '/v1/onboarding/allergy',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addAllergy)
);

router.get(
  '/v1/onboarding',
  requireAuth,
  handleAsync(onboardingController.getOnboardingData)
);
// TODO:
/**
 1. endpoint to onboard medical_procedures POST '/v1/onboarding/medical-procedures' completed
 2. endpoint to onboard allergy POST '/v1/onboarding/allergy' completed
 3. endpoint to retrieve Hajj onboarding data GET '/v1/onbarding' { onboarding_medical_procedures_completed: false, onboarding_allergy_completed: true, onboarding_health_conditions_completed: true } completed
 4. profile endpoints (considering passport image)
 5. statistics endpoints for admin only
 */

module.exports = router;
