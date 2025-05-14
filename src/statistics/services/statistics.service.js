const { QueryTypes } = require("sequelize");
const db = require("../../models");

const queries = {
  totalCategories: 'SELECT COUNT(*) AS TotalCategories FROM Category;',
  totalCountries: 'SELECT COUNT(*) AS TotalCountries FROM countries;',
  pilgrimDistributionByNationality: `SELECT country_Nationality, COUNT(*) AS PilgrimCount
    FROM pilgrims_data
    JOIN countries ON pilgrims_data.hajj_nid = countries.country_code
    GROUP BY country_Nationality;`,
  totalClinicVisits: 'SELECT COUNT(*) AS TotalClinicVisits FROM clinics_visits;',
  mostCommonDiagnoses: `SELECT cv_diagnosis_id, COUNT(*) AS DiagnosisCount
    FROM clinics_visits
    GROUP BY cv_diagnosis_id
    ORDER BY DiagnosisCount DESC;`,
  drugsPrescribedFrequency: `SELECT drug_id, COUNT(*) AS PrescriptionCount
    FROM clinics_visits_drug
    GROUP BY drug_id
    ORDER BY PrescriptionCount DESC;`,
  clinicVisitTrends: `SELECT YEAR(cv_visit_date) AS VisitYear, MONTH(cv_visit_date) AS VisitMonth, COUNT(*) AS VisitCount
    FROM clinics_visits
    GROUP BY YEAR(cv_visit_date), MONTH(cv_visit_date)
    ORDER BY VisitYear, VisitMonth;`,
  totalDeathCases: 'SELECT COUNT(*) AS TotalDeathCases FROM death_cases;',
  causesOfDeathFrequency: `SELECT dc_causeofdeath, COUNT(*) AS CauseCount
    FROM death_cases
    GROUP BY dc_causeofdeath
    ORDER BY CauseCount DESC;`,
  deathsByLocation: `SELECT dc_hosp, COUNT(*) AS DeathCount
    FROM death_cases
    GROUP BY dc_hosp
    ORDER BY DeathCount DESC;`,
  totalDialysisSessions: 'SELECT COUNT(*) AS TotalDialysisSessions FROM dialysis;',
  dialysisPatientsByLocation: `SELECT kd_citizen_hosp, COUNT(*) AS PatientCount
    FROM dialysis
    GROUP BY kd_citizen_hosp
    ORDER BY PatientCount DESC;`,
  chronicDiseasePrevalence: `SELECT 
    SUM(CASE WHEN has_hypertension = 1 THEN 1 ELSE 0 END) AS HypertensionCount,
    SUM(CASE WHEN has_diabetes = 1 THEN 1 ELSE 0 END) AS DiabetesCount,
    SUM(CASE WHEN has_cancer = 1 THEN 1 ELSE 0 END) AS CancerCount
    FROM extra_medical_records;`,
  medicalProcedureFrequency: `SELECT 
    SUM(CASE WHEN had_surgery = 1 THEN 1 ELSE 0 END) AS SurgeryCount,
    SUM(CASE WHEN had_kidney_dialysis = 1 THEN 1 ELSE 0 END) AS DialysisCount,
    SUM(CASE WHEN had_chemotherapy_or_radiotherapy = 1 THEN 1 ELSE 0 END) AS ChemotherapyCount
    FROM extra_medical_records;`,
  allergiesReported: `SELECT 
    SUM(CASE WHEN has_drug_allergy = 1 THEN 1 ELSE 0 END) AS DrugAllergyCount,
    SUM(CASE WHEN has_food_allergy = 1 THEN 1 ELSE 0 END) AS FoodAllergyCount
    FROM extra_medical_records;`,
  totalOncologySessions: 'SELECT COUNT(*) AS TotalOncologySessions FROM oncology;',
  oncologyPatientsByLocation: `SELECT oncol_citizen_hosp, COUNT(*) AS PatientCount
    FROM oncology
    GROUP BY oncol_citizen_hosp
    ORDER BY PatientCount DESC;`,
  totalMedicalExaminations: 'SELECT COUNT(*) AS TotalMedicalExaminations FROM medical_examination;',
  commonHealthConditions: `SELECT mex_citizen_diseases_id, COUNT(*) AS ConditionCount
    FROM medical_examination
    GROUP BY mex_citizen_diseases_id
    ORDER BY ConditionCount DESC;`,
  bmiDistribution: `SELECT mex_citizen_bmi, COUNT(*) AS Count
    FROM medical_examination
    GROUP BY mex_citizen_bmi
    ORDER BY mex_citizen_bmi;`,
  totalPilgrims: 'SELECT COUNT(*) AS TotalPilgrims FROM pilgrims_data;',
  pilgrimDemographics: `SELECT hajj_gender_id, COUNT(*) AS GenderCount
    FROM pilgrims_data
    GROUP BY hajj_gender_id;`,
  totalUserAccounts: 'SELECT COUNT(*) AS TotalUserAccounts FROM user_accounts;',
  userRolesDistribution: `SELECT role, COUNT(*) AS RoleCount
    FROM user_accounts
    GROUP BY role;`,
  totalCorrelations: 'SELECT COUNT(*) AS TotalCorrelations FROM CorrelationLogs;',
  correlationTrends: `SELECT YEAR(CreatedAt) AS Year, MONTH(CreatedAt) AS Month, COUNT(*) AS CorrelationCount
    FROM CorrelationLogs
    GROUP BY YEAR(CreatedAt), MONTH(CreatedAt)
    ORDER BY Year, Month;`,
  activeLookupValues: 'SELECT COUNT(*) AS ActiveLookups FROM lookup_table WHERE active = 1;',
  totalMigrations: 'SELECT COUNT(*) AS TotalMigrations FROM SequelizeMeta;',
  totalReferrals: 'SELECT COUNT(*) AS TotalReferrals FROM referral;',
  commonReferralReasons: `SELECT refl_reason, COUNT(*) AS ReasonCount
    FROM referral
    GROUP BY refl_reason
    ORDER BY ReasonCount DESC;`
};

const runQuery = async (dashboardName) => {
  const query = queries[dashboardName];
  if (!query) return null;
  return await db.sequelize.query(query, { type: QueryTypes.SELECT });
};

module.exports = { runQuery };
