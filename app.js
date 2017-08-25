/**
 * Created by alsayed on 2/17/17.
 */
'use strict';
var express = require('express');
var app = module.exports = express();
var crossOrigin = require('./middlewares/CrossOrigin');
var bodyParser = require('body-parser');
var passport = require('passport');
var db = require('./config/database');

var server = app.listen(process.env.PORT || process.env.$PORT || 5000, function () {
	console.log ('Server started on port: ' + server.address().port);
});

app.use(express.static('pages'))

app.use(bodyParser.json({limit: '50mb'}));

app.use(passport.initialize());
app.use(passport.session());


require('./api/api');


app.get('/index', function(req, res, next){
  res.sendFile('./pages/index.html')
})
