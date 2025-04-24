'use strict';

module.exports = (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define(
    'MedicalRecord',
    {
      hajjId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hajj_id',
        references: {
          model: 'pilgrims_data',
          key: 'hajj_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // Medical Procedures
      was_hospitalized: DataTypes.BOOLEAN,
      was_in_icu: DataTypes.BOOLEAN,
      had_surgery: DataTypes.BOOLEAN,
      had_catheterization: DataTypes.BOOLEAN,
      had_kidney_dialysis: DataTypes.BOOLEAN,
      had_chemotherapy_or_radiotherapy: DataTypes.BOOLEAN,
      had_gastro_endoscopy: DataTypes.BOOLEAN,
      had_other_endoscopy: DataTypes.BOOLEAN,
      other_endoscopy_details: DataTypes.STRING,
      other_procedures: DataTypes.BOOLEAN,
      other_procedures_details: DataTypes.STRING,
      onboarding_others_completed: DataTypes.BOOLEAN,

      // Chronic Conditions
      has_hypertension: DataTypes.BOOLEAN,
      has_diabetes: DataTypes.BOOLEAN,
      has_heart_failure: DataTypes.BOOLEAN,
      has_coronary_artery_disease: DataTypes.BOOLEAN,
      has_liver_cirrhosis: DataTypes.BOOLEAN,
      has_kidney_failure: DataTypes.BOOLEAN,
      has_cancer: DataTypes.BOOLEAN,
      has_brain_bleed_or_stroke: DataTypes.BOOLEAN,
      has_paralysis: DataTypes.BOOLEAN,
      has_neuro_psych_disorders: DataTypes.BOOLEAN,
      has_mouth_bleeding: DataTypes.BOOLEAN,
      has_rectal_bleeding: DataTypes.BOOLEAN,
      has_gastric_ulcer: DataTypes.BOOLEAN,
      has_asthma: DataTypes.BOOLEAN,
      has_tuberculosis: DataTypes.BOOLEAN,
      has_pulmonary_fibrosis: DataTypes.BOOLEAN,
      has_autoimmune_disease: DataTypes.BOOLEAN,
      has_chronic_blood_disease: DataTypes.BOOLEAN,
      has_other_diseases: DataTypes.BOOLEAN,
      has_other_diseases_details: DataTypes.STRING,
      onboarding_health_conditions_completed: DataTypes.BOOLEAN,

      // Allergies
      has_drug_allergy: DataTypes.BOOLEAN,
      has_food_allergy: DataTypes.BOOLEAN,
      has_other_allergy: DataTypes.BOOLEAN,
      has_other_allergy_details: DataTypes.STRING,
      onboarding_allergy_completed: DataTypes.BOOLEAN, 
    },
    {
      tableName: 'extra_medical_records',
      underscored: true,
      timestamps: true,
    }
  );

  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(models.PilgrimsData, {
      foreignKey: 'hajjId',
      as: 'pilgrim',
    });
  };

  return MedicalRecord;
};
