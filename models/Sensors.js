'use strict';
module.exports = function (sequelize, DataTypes) {

  const Sensors = sequelize.define('Sensors', {
    sensorId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    range: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.CHAR(50),
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
