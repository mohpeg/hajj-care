const express = require("express");
const { getDashboardStatistic } = require("./controllers/statistics.controller");
const requireAuth = require("../middlewares/require-auth.middleware");
const requireRoles = require("../middlewares/require-role");
const { ROLES } = require("../constants/roles");

const router = express.Router();

/**
 * @swagger
 * /statistics/{dashboardName}:
 *   get:
 *     summary: Retrieve statistics based on the dashboard name
 *     description: Fetches specific statistics by providing the dashboard name as a path parameter.
 *     parameters:
 *       - in: path
 *         name: dashboardName
 *         required: true
 *         description: The name of the dashboard/statistic to retrieve.
 *         schema:
 *           type: string
 *           enum:
 *             - totalCategories
 *             - totalCountries
 *             - pilgrimDistributionByNationality
 *             - totalClinicVisits
 *             - mostCommonDiagnoses
 *             - drugsPrescribedFrequency
 *             - clinicVisitTrends
 *             - totalDeathCases
 *             - causesOfDeathFrequency
 *             - deathsByLocation
 *             - totalDialysisSessions
 *             - dialysisPatientsByLocation
 *             - chronicDiseasePrevalence
 *             - medicalProcedureFrequency
 *             - allergiesReported
 *             - totalOncologySessions
 *             - oncologyPatientsByLocation
 *             - totalMedicalExaminations
 *             - commonHealthConditions
 *             - bmiDistribution
 *             - totalPilgrims
 *             - pilgrimDemographics
 *             - totalUserAccounts
 *             - userRolesDistribution
 *             - activeInactiveUsers
 *             - totalCorrelations
 *             - correlationTrends
 *             - activeLookupValues
 *             - totalMigrations
 *             - totalReferrals
 *             - commonReferralReasons
 *           example: totalCategories
 *     responses:
 *       200:
 *         description: Successfully retrieved the statistic.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *       404:
 *         description: Dashboard not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Dashboard not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get(
  "/v1/statistics/:dashboardName",
  requireAuth,
  requireRoles([ROLES.ADMIN]),
  getDashboardStatistic
);

module.exports = router;
