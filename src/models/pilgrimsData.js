'use strict';

module.exports = (sequelize, DataTypes) => {
  const PilgrimsData = sequelize.define(
    'PilgrimsData',
    {
      hajjId: {
        type: DataTypes.INTEGER,
        primaryKey: true,        // ✅ لأنه المفتاح الأساسي في الجدول
        allowNull: false,
        field: 'hajj_id',
      },
      governmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hajj_gov',
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'hajj_name',
      },
      genderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hajj_gender_id',
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hajj_age',
      },
      nationalId: {
        type: DataTypes.STRING(14),
        allowNull: false,
        field: 'hajj_nid',
      },
      passportNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'hajj_passport',
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hajj_type_id',
      },
    },
    {
      tableName: 'pilgrims_data',
      underscored: true,
      timestamps: false,
    }
  );

  PilgrimsData.associate = function (models) {
    // relationships can be defined later
  };

  return PilgrimsData;
};