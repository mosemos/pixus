'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('Sensors', {
      examId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      examDatetime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      machineId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      machineName: {
        type: Sequelize.CHAR(50)
      },
      facilityId: {
        type: Sequelize.INTEGER
      },
      facilityCode: {
        type: Sequelize.CHAR(100)
      },
      facilityName: {
        type: Sequelize.CHAR(100)
      },
      protocolId: {
        type: Sequelize.INTEGER
      },
      protocolCode: {
        type: Sequelize.FLOAT
      },
      protocolName: {
        type: Sequelize.CHAR(100)
      },
      totalNumberOfIrradiationEvents: {
        type: Sequelize.INTEGER
      },
      doseLengthProductTotal: {
        type: Sequelize.FLOAT
      },
      normalizedDlp: {
        type: Sequelize.FLOAT
      },
      ctdiVolMax: {
        type: Sequelize.FLOAT
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Sensors');
  }
};
