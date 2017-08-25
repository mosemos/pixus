'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('Sensors', {
      sensorId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      range: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.CHAR(50),
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Sensors');
  }
};
