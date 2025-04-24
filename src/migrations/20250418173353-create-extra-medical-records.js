'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('extra_medical_records', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // Foreign Key إلى جدول الحجاج
      hajjId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'hajj_id',
        references: {
          model: 'pilgrims_data', // اسم الجدول في قاعدة البيانات
          key: 'hajj_id', // اسم العمود المرتبط
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // القسم الأول: الإجراءات الطبية
      was_hospitalized: Sequelize.BOOLEAN,
      was_in_icu: Sequelize.BOOLEAN,
      had_surgery: Sequelize.BOOLEAN,
      had_catheterization: Sequelize.BOOLEAN,
      had_kidney_dialysis: Sequelize.BOOLEAN,
      had_chemotherapy_or_radiotherapy: Sequelize.BOOLEAN,
      had_gastro_endoscopy: Sequelize.BOOLEAN,
      had_other_endoscopy: Sequelize.BOOLEAN,
      other_endoscopy_details: Sequelize.STRING,
      other_procedures: Sequelize.BOOLEAN,
      other_procedures_details: Sequelize.STRING,
      onboarding_others_completed: Sequelize.BOOLEAN,

      // القسم الثاني: الأمراض المزمنة
      has_hypertension: Sequelize.BOOLEAN,
      has_diabetes: Sequelize.BOOLEAN,
      has_heart_failure: Sequelize.BOOLEAN,
      has_coronary_artery_disease: Sequelize.BOOLEAN,
      has_liver_cirrhosis: Sequelize.BOOLEAN,
      has_kidney_failure: Sequelize.BOOLEAN,
      has_cancer: Sequelize.BOOLEAN,
      has_brain_bleed_or_stroke: Sequelize.BOOLEAN,
      has_paralysis: Sequelize.BOOLEAN,
      has_neuro_psych_disorders: Sequelize.BOOLEAN,
      has_mouth_bleeding: Sequelize.BOOLEAN,
      has_rectal_bleeding: Sequelize.BOOLEAN,
      has_gastric_ulcer: Sequelize.BOOLEAN,
      has_asthma: Sequelize.BOOLEAN,
      has_tuberculosis: Sequelize.BOOLEAN,
      has_pulmonary_fibrosis: Sequelize.BOOLEAN,
      has_autoimmune_disease: Sequelize.BOOLEAN,
      has_chronic_blood_disease: Sequelize.BOOLEAN,
      has_other_diseases: Sequelize.BOOLEAN,
      has_other_diseases_details: Sequelize.STRING,
      onboarding_health_conditions_completed: Sequelize.BOOLEAN,

      has_drug_allergy: Sequelize.BOOLEAN,
      has_food_allergy: Sequelize.BOOLEAN,
      has_other_allergy: Sequelize.BOOLEAN,
      has_other_allergy_details: Sequelize.STRING,
      onboarding_allergy_completed: Sequelize.BOOLEAN,

      // Timestamps
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('extra_medical_records');
  },
};
