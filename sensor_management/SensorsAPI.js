/**
 * Created by alsayed on 3/4/17.
 */
var express = require('express');
var path = require('path');
var rootPath = path.resolve('.');
var app = require(rootPath + '/app');
var db = require(rootPath + '/config/database');
var status = require(rootPath + '/config/httpStatusCodes');
var router = express.Router();
var clientErrorHandler = require(rootPath + '/middlewares/ClientErrorHandler');
var isLoggedIn = require(rootPath + '/middlewares/EnsureLoggedIn');
var actionLogger = require(rootPath + '/middlewares/ActionLogger');
var rbac = require(rootPath + '/middlewares/AccessControl');
var logErrors = require(rootPath + '/middlewares/LogErrors');
var WebError = require('web-error').default;

var sensorsStatusEnums = require(path.resolve('.') + '/enums.json')['sensorsStatusEnums'];
var sensorsReadingStatusEnums = require(path.resolve('.')+'/enums.json')['sensorsReadingStatusEnums'];
var settingsEnums = require(path.resolve('.')+'/enums.json')['settingsEnums'];

app.use('/', router);

// ************** sensors *****************
//
router.get('/hello_sensor', function(req, res, next){
  console.log('hello_sensor')
  db.Sensors.findAll()
    .then(function(sensors){
      res.status(200).send(sensors);
    })
    .catch(function(err){
      res.status(200).send("err: " + err);
    })
});

router.get('/index', function(req, res, next){
  res.sendFile(rootPath + '/pages/index.html')
})

router.get('/sensors/get_sensor/:sensorId',
isLoggedIn,
rbac.can('view sensor'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  db.Sensors
      .findById(sensorId)
      .then(function (sensor) {
          if(sensor){
              res.status(status.OK).send(sensor);
          }
          else{
              throw new WebError(status.BAD_REQUEST, 'sensor not found')
          }
      })
      .catch(function (err) {
        next(err);
      });
});

router.get('/sensors/get_all_sensors',
isLoggedIn,
rbac.can('view all sensors'),
function (req, res, next) {
  db.Sensors
      .findAll()
      .then(function (sensors) {
        res.status(status.OK).send(sensors);
      })
      .catch(function (err) {
        next(err);
      });
});

router.get('/sensors/get_sensors_for_map',
rbac.can('view all sensors map'),
function(req, res, next){
  db.Sensors
    .findAll({include: [{model: db.SensorTypes, attributes: ['sensorTypeId', 'name', 'icon'], include: [{model: db.ReadingTypes, attributes: ['readingTypeId', 'name', 'unit']}]}]})
    .then(function(sensors){
      res.status(status.OK).send(sensors);
    })
    .catch(function(err){
      next(err);
    });
});

router.get('/sensors/get_all_sensors_with_deleted',
isLoggedIn,
rbac.can('view all sensors'),
function (req, res, next) {
  db.Sensors
      .findAll({ paranoid: false })
      .then(function (sensors) {
          if(sensors){
            res.status(status.OK).send(sensors);
            next()
          }
      })
      .catch(function (err) {
        next(err);
      });
});

router.get('/sensors/get_sensors_in_range',
isLoggedIn,
rbac.can('view all sensors'),
function (req, res, next) {
  const data = req.query;
  db.Sensors
      .findAll({
          offset: parseInt(data.offset),
          limit: parseInt(data.limit),
        })
      .then(function (sensors) {
          if(sensors){
              res.status(status.OK).send(sensors);
              next();
          }
      })
      .catch(function (err) {
        next(err);
      });
});

router.post('/sensors/add_sensor',
isLoggedIn,
rbac.can('add sensor'),
function (req, res, next) {
  const data = req.body.sensor;
  db.Sensors
      .create({
        realSensorId: data.realSensorId,
        sensorTypeIdFK: data.sensorTypeId,
        name: data.name,
        sensorStatus: data.sensorStatus,
        overrideTimeout: data.overrideTimeout == ''? null : data.overrideTimeout,
        latitude: data.latitude,
        longitude: data.longitude,
      })
      .then(function (sensor) {
          res.status(status.OK).send(sensor);
          res.instance = sensor;
          next();
      })
      .catch(function (err) {
          next(err);
        });
},
actionLogger
);

router.post('/sensors/update_sensor/:sensorId',
isLoggedIn,
rbac.can('edit sensor'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  const lon = req.body.updates.longitude;
  const lat = req.body.updates.latitude;

  if(lon == null || lat == null){
    throw new WebError(status.BAD_REQUEST, 'Longitude or Latitude cannot be null');
  }

  db.Sensors
      .findById(sensorId)
      .then(function (sensor) {
          return sensor.updateAttributes({longitude: lon, latitude: lat});
      })
      .then(function (sensor) {
          res.status(status.OK).send(sensor);
          res.instance = sensor;
          next()
      })
      .catch(function (err) {
        next(err);
      });
},
actionLogger
);

router.post('/sensors/update_sensor_status/:sensorId',
isLoggedIn,
rbac.can('edit sensor'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  const sensorStatus = req.body.sensorStatus;

  if(sensorStatus == null){
    throw new WebError(status.BAD_REQUEST, 'Status cannot be empty');
  }

  db.Sensors.findById(sensorId)
      .then(function (sensor) {
          if(sensor){
            return sensor.updateSensorStatus(sensorStatus);
          }
          else{
            throw new WebError(status.BAD_REQUEST, 'Sensor not found');
          }
      })
      .then(function (sensor) {
          res.instance = sensor;
          res.status(status.OK).send(sensor);
          next()
      })
      .catch(function (err) {
        next(err);
      });
},
actionLogger
);

router.post('/sensors/override_sensor/:sensorId',
rbac.can('override alarm'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  const overrideTimeout = req.body.overrideTimeout ? req.body.overrideTimeout : 'NULL';

  // check timeout to be a date after the current time
  if(req.body.overrideTimeout && isNaN(Date.parse(overrideTimeout))){
    throw new WebError(status.BAD_REQUEST, 'Incorrect date format of Override Timeout');
  }
  else if(req.body.overrideTimeout && Date.parse(overrideTimeout) < new Date()){
    throw new WebError(status.BAD_REQUEST, 'Override Timeout cannot be before current date');
  }

  db.Settings.find({where: {name: settingsEnums.overrideAlarmFeature}})
    .then(function(settings){
      if(settings.value == "disabled"){
        throw new WebError(status.BAD_REQUEST, 'Override alarm feature is disabled');
      }
      else{
        return db.Sensors.findById(sensorId)
      }
    })
    .then(function (sensor) {
      if (sensor) {
        if(sensor.readingStatus == null){
          throw new WebError(status.BAD_REQUEST, 'sensor has to be either ' + sensorsReadingStatusEnums.high + ' or ' + sensorsReadingStatusEnums.highhigh);
        }
        else{
          return sensor.updateSensorStatus(sensor.sensorStatus, overrideTimeout);
        }
      }
      else{
          throw new WebError(status.BAD_REQUEST, 'sensor not found');
      }
    })
    .then(function (sensor) {
        res.status(status.OK).send(sensor);
        res.instance = sensor;
        next();
    })
    .catch(function (err) {
      next(err);
    });
},
actionLogger
);

router.post('/sensors/override_all_sensors',
rbac.can('override all alarms'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  const overrideTimeout = req.body.overrideTimeout;

  // check timeout to be a date after the current time
  if(isNaN(Date.parse(overrideTimeout))){
    throw new WebError(status.BAD_REQUEST, 'Incorrect date format of override timeout');
  }
  else if(Date.parse(overrideTimeout) < new Date()){
    throw new WebError(status.BAD_REQUEST, 'Override timeout date cannot be before current date');
  }

  db.Settings.find({where: {name: settingsEnums.overrideAlarmFeature}})
    .then(function(settings){
      if(settings.value == "disabled"){
        throw new WebError(status.BAD_REQUEST, 'Override alarm feature is disabled');
      }
      else{
        return db.Sensors.findAll()
      }
    })
    .then(function(sensors){

      var updateSensorStatus = function(sensor){
        // only override the sensors with alarms
        if(sensor.readingStatus == sensorsReadingStatusEnums.high || sensor.readingStatus == sensorsReadingStatusEnums.highhigh){
          return sensor.updateSensorStatus(sensor.sensorStatus, overrideTimeout);
        }
      };

      return Promise.all(sensors.map(updateSensorStatus));

    })
    .then(function(){
        return db.Sensors.findAll({where: {overrideTimeout: {$gt: new Date()}}}); // get all sensors with overrideTimeout > current date
    })
    .then(function(updated){
      res.status(status.OK).send(updated);
      res.instance = updated;
      next();
    })
    .catch(function (err) {
      next(err);
    });
},
actionLogger
);

router.post('/sensors/delete_sensor/:sensorId',
isLoggedIn,
rbac.can('delete sensor'),
function (req, res, next) {
  const sensorId = req.params.sensorId;
  db.Sensors
      .findById(sensorId)
      .then(function (instance) {
        if (instance) {
          return instance.destroy();
        }
        else{
            throw new WebError(status.BAD_REQUEST, 'sensor not found');
        }
      })
      .then(function (sensor) {
          res.status(status.OK).send(sensor);
          res.instance = sensor;
          next();
      })
      .catch(function (err) {
        next(err);
      });
},
actionLogger
);
