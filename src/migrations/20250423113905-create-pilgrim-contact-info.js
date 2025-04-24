'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PilgrimContactInfo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      hajjId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'hajj_id',
        references: {
          model: 'pilgrims_data', // Reference to the PilgrimsData table
          key: 'hajj_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      national_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      passport_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      hotel_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      room_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primary_mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergency_mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passport_image: {
        type: Sequelize.STRING, // Path to uploaded image
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('GETDATE'), // or Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('GETDATE'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PilgrimContactInfo');
  },
};
