const { Router } = require('express');
const requireAuth = require('../middlewares/require-auth.middleware');

const onboardingController = require('./controllers/onboarding.controller');
const handleAsync = require('../lib/handle-async');

const router = Router();

/**
 * @swagger
 * /v1/onboarding/health-conditions:
 *   post:
 *     summary: Submit pilgrim health conditions
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               has_hypertension:
 *                 type: boolean
 *               has_diabetes:
 *                 type: boolean
 *               has_heart_failure:
 *                 type: boolean
 *               has_coronary_artery_disease:
 *                 type: boolean
 *               has_liver_cirrhosis:
 *                 type: boolean
 *               has_kidney_failure:
 *                 type: boolean
 *               has_cancer:
 *                 type: boolean
 *               has_brain_bleed_or_stroke:
 *                 type: boolean
 *               has_paralysis:
 *                 type: boolean
 *               has_neuro_psych_disorders:
 *                 type: boolean
 *               has_mouth_bleeding:
 *                 type: boolean
 *               has_rectal_bleeding:
 *                 type: boolean
 *               has_gastric_ulcer:
 *                 type: boolean
 *               has_asthma:
 *                 type: boolean
 *               has_tuberculosis:
 *                 type: boolean
 *               has_pulmonary_fibrosis:
 *                 type: boolean
 *               has_autoimmune_disease:
 *                 type: boolean
 *               has_chronic_blood_disease:
 *                 type: boolean
 *               has_other_diseases:
 *                 type: boolean
 *               has_other_diseases_details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health conditions recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/v1/onboarding/health-conditions',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addHealthConditions)
);

/**
 * @swagger
 * /v1/onboarding/medical-procedures:
 *   post:
 *     summary: Submit pilgrim medical procedures
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               was_hospitalized:
 *                 type: boolean
 *               was_in_icu:
 *                 type: boolean
 *               had_surgery:
 *                 type: boolean
 *               had_catheterization:
 *                 type: boolean
 *               had_kidney_dialysis:
 *                 type: boolean
 *               had_chemotherapy_or_radiotherapy:
 *                 type: boolean
 *               had_gastro_endoscopy:
 *                 type: boolean
 *               had_other_endoscopy:
 *                 type: boolean
 *               other_endoscopy_details:
 *                 type: string
 *               other_procedures:
 *                 type: boolean
 *               other_procedures_details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical procedures recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/v1/onboarding/medical-procedures',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addMedicalProcedures)
);

/**
 * @swagger
 * /v1/onboarding/allergy:
 *   post:
 *     summary: Submit pilgrim allergies
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               has_drug_allergy:
 *                 type: boolean
 *               has_food_allergy:
 *                 type: boolean
 *               has_other_allergy:
 *                 type: boolean
 *               other_allergy_details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Allergy information recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/v1/onboarding/allergy',
  requireAuth,
  // requireRoles(['pilgrim']),
  handleAsync(onboardingController.addAllergy)
);

/**
 * @swagger
 * /v1/onboarding:
 *   get:
 *     summary: Retrieve pilgrim onboarding data
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved onboarding data
 *       404:
 *         description: No record found
 *       401:
 *         description: Unauthorized
 */
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
