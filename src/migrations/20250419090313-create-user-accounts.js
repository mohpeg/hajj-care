'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_accounts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      hajjId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'hajj_id',
        references: {
          model: 'pilgrims_data', // اسم الجدول اللي عند المهندسة رحاب
          key: 'hajj_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      middleName: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      passportNumber: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: false,
      },
      nationalId: {
        type: Sequelize.STRING(14),
        allowNull: true,
        unique: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'doctor', 'moderator', 'pilgrim'),
        allowNull: false,
        defaultValue: 'pilgrim',
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: false,
      },
      hashedPassword: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      mobileNumber: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
    });

    await queryInterface.addIndex('user_accounts', ['username'], {
      unique: true,
      where: {
        username: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    await queryInterface.addIndex('user_accounts', ['nationalId'], {
      unique: true,
      where: {
        nationalId: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    await queryInterface.addIndex('user_accounts', ['passportNumber'], {
      unique: true,
      where: {
        passportNumber: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    await queryInterface.addIndex('user_accounts', ['mobileNumber'], {
      unique: true,
      where: {
        mobileNumber: {
          [Sequelize.Op.ne]: null,
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_accounts');
  },
};
