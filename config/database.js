/**
 * Created by alsayed on 3/6/17.
 */
    var Sequelize = require('sequelize');
    var fs        = require('fs');
    var path      = require('path');
    var basename  = path.basename(module.filename);
    var env       = process.env.NODE_ENV || 'development';
    var config    = require('./config.json')[env];
    var root = path.resolve('.');
    var db = {};

    if (config.use_env_variable) {
      var sequelize = new Sequelize(process.env[config.use_env_variable]);
    } else {
      // "postgres://uvcjyzuk69jnecor:pijjsnq7j0hkvs63opuohige0@db-0de4e9fa-f611-4df4-9dcd-452f6977a19e.c7uxaqxgfov3.us-west-2.rds.amazonaws.com:5432/postgres"
      var sequelize = new Sequelize("mysql://root:root@localhost:3306/postgres", {
            logging: false
        });
    }

    // adding the models to the db variable
    fs
        .readdirSync(root + '/models/')
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
          })
        .forEach(function (file) {
            var model = sequelize['import'](path.join(root + '/models/', file));
            db[model.name] = model;
          });

    Object.keys(db).forEach(function (modelName) {
        if (db[modelName].associate) {
          db[modelName].associate(db);
        }
      });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

module.exports = db;
