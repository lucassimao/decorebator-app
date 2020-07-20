'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`INSERT INTO public."Users"(name, "encryptedPassword", country, email, "createdAt", "updatedAt") values 
    ('lucas','$2b$10$cvMBat5MB5MtD53gK/RGse/N.70HGSU1Qv9XA8js3ew4HFU0Y.L1K','BR','lsimaocosta@gmail.com','2020-07-20 03:42:49.679+00','2020-07-20 03:42:49.679+00')`)
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query('DELETE FROM public."Users" where email="lsimaocosta@gmail.com"')
  }
};
