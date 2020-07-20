'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('BinaryExtractions', 'extractionMs', { type: Sequelize.REAL });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('BinaryExtractions', 'extractionMs', { type: Sequelize.INTEGER });
  }
};
