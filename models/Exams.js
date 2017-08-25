'use strict';
module.exports = function (sequelize, DataTypes) {

  const Sensors = sequelize.define('Exams', {
    examId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    examDatetime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    machineId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    machineName: {
      type: DataTypes.CHAR(50)
    },
    facilityId: {
      type: DataTypes.INTEGER
    },
    facilityCode: {
      type: DataTypes.CHAR(100)
    },
    facilityName: {
      type: DataTypes.CHAR(100)
    },
    protocolId: {
      type: DataTypes.INTEGER
    },
    protocolCode: {
      type: DataTypes.FLOAT
    },
    protocolName: {
      type: DataTypes.CHAR(100)
    },
    totalNumberOfIrradiationEvents: {
      type: DataTypes.INTEGER
    },
    doseLengthProductTotal: {
      type: DataTypes.FLOAT
    },
    normalizedDlp: {
      type: DataTypes.FLOAT
    },
    ctdiVolMax: {
      type: DataTypes.FLOAT
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
      },
    },
    instanceMethods: {
    }
  });

  return Sensors;
};
