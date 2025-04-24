'use strict';

const { QueryTypes } = require('sequelize');

// This migration script sync the pilgrams data into the user_account data so we can implement the login endpoint relying on the user_accounts
// because we may have users who are not pilgrims and we need to have a generic table for all users

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(`
        INSERT INTO [dbo].[user_accounts] (hajj_id, firstName, middleName, lastName, passportNumber, nationalId, [role], username, hashedPassword, mobileNumber, createdAt, updatedAt)
        SELECT 
        hajj_id,
        LEFT(hajj_name, CHARINDEX(' ', hajj_name) - 1) AS firstName,
        CASE 
          WHEN LEN(hajj_name) - LEN(REPLACE(hajj_name, ' ', '')) > 1 THEN 
        SUBSTRING(hajj_name, CHARINDEX(' ', hajj_name) + 1, LEN(hajj_name) - CHARINDEX(' ', hajj_name) - CHARINDEX(' ', REVERSE(hajj_name)))
          ELSE NULL
        END AS middleName,
        RIGHT(hajj_name, CHARINDEX(' ', REVERSE(hajj_name)) - 1) AS lastName,
        CASE 
          WHEN LTRIM(RTRIM(hajj_passport)) = '' THEN NULL
          ELSE hajj_passport
        END AS passportNumber,
        hajj_nid,
        'pilgrim' AS [role],
        NULL as username,
        NULL AS hashedPassword,
        NULL AS mobileNumber,
        GETDATE() AS created_at,
        GETDATE() AS updated_at
        FROM [dbo].[pilgrims_data];
      `);
    } catch (exc) {
      console.error(exc);
      throw exc;
    }

    // const allPilgams = await queryInterface.sequelize.query(`select * from dbo.pilgrams_data`, { type: QueryTypes.SELECT});
    // for (const pilgram of allPilgams) {
    //   await queryInterface.sequelize.query(`
    //     INSERT INTO [dbo].[user_accounts] (hajj_id, full_name, passport_number, national_id, [role], username, hashedPassword, mobileNumber, created_at, updated_at)
    //     VALUES (
    //       ${pilgram.hajj_id},
    //       '${pilgram.hajj_name}',
    //       '${pilgram.hajj_passport}',
    //       '${pilgram.hajj_nid}',
    //       'pilgrim',
    //       NULL,
    //       NULL,
    //       NULL,
    //       GETDATE(),
    //       GETDATE()
    //     );
    //   `);
    // }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM [dbo].[user_accounts]
      WHERE [role] = 'pilgrim';
    `);
  },
};
