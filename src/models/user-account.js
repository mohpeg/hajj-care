'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserAccount = sequelize.define(
    'UserAccount',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      hajjId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'hajj_id',
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      middleName: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      passportNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      nationalId: {
        type: DataTypes.STRING(14),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'doctor', 'moderator', 'pilgrim'),
        allowNull: false,
        defaultValue: 'pilgrim',
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mobileNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },
      emergencyMobileNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false,
      },
      passportImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hotelName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roomNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'user_accounts',
      timestamps: true,
    }
  );

  UserAccount.associate = (models) => {
    UserAccount.belongsTo(models.PilgrimsData, {
      foreignKey: 'hajjId',
      targetKey: 'hajjId',
      as: 'pilgrim',
    });
    UserAccount.hasOne(models.MedicalRecord, {
      foreignKey: 'hajjId',
      sourceKey: 'hajjId',
      as: 'medicalRecords',
    });
  };


  return UserAccount;
};
