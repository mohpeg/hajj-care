'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PilgrimContactInfo extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  PilgrimContactInfo.init(
    { hajjId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'hajj_id',
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      national_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      passport_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      hotel_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      room_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primary_mobile_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergency_mobile_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passport_image: {
        type: DataTypes.STRING,
        allowNull: true, // store as image path or filename
      },
    },
    {
      sequelize,
      modelName: 'PilgrimContactInfo',
      tableName: 'PilgrimContactInfo',
      timestamps: true,
    }
  );

  PilgrimContactInfo.associate = (models) => {
    PilgrimContactInfo.belongsTo(models.PilgrimsData, {
      foreignKey: 'hajjId',
      targetKey: 'hajjId'
    });
  };
  return PilgrimContactInfo;
};
