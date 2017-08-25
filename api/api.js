var express = require('express');
var path = require('path');
var rootPath = path.resolve('.');
var app = require(rootPath + '/app');
var db = require(rootPath + '/config/database');
var status = require(rootPath + '/config/httpStatusCodes');
var router = express.Router();

app.use('/api', router);

router.get('/get_all_exams', function(req, res, next){
  db.Exams.findAll()
    .then(function(exams){
      res.status(200).send('length: ' + exams.length)
    })
    .catch(function(err){
      res.status(400).send(err);
    });
});


router.get('/get_problem_result', function(req, res, next){
  var machineName = req.query.machineName;
  var protocolCode = req.query.protocolCode;
  var lastDays = req.query.lastDays || 0;

  db.Exams.findAll({
    where: {protocolCode: protocolCode}
  })
  .then(function(allExams){
    var aggregateDlp = {};
    var aggregateCtdi = {};
    var aggregateSum = {};

    allExams.forEach(function(exam){
      if(aggregateDlp[exam.machineName] == null){
        aggregateDlp[exam.machineName] = parseFloat(exam.normalizedDlp);
        aggregateCtdi[exam.machineName] = parseFloat(exam.ctdiVolMax);
        aggregateSum[exam.machineName] = 1;
      }
      else{
        aggregateDlp[exam.machineName] = parseFloat(aggregateDlp[exam.machineName]) + parseFloat(exam.normalizedDlp);
        aggregateCtdi[exam.machineName] = parseFloat(aggregateCtdi[exam.machineName]) + parseFloat(exam.ctdiVolMax);
        aggregateSum[exam.machineName] = parseInt(aggregateSum[exam.machineName]) + 1;
      }
    })

    for (var machineName in aggregateSum) {
      if (aggregateSum.hasOwnProperty(machineName)) {
        aggregateDlp[machineName] = parseFloat((aggregateDlp[machineName] / (1.0 * parseInt(aggregateSum[machineName]))).toFixed(2));
        aggregateCtdi[machineName] = parseFloat((aggregateCtdi[machineName] / (1.0 * parseInt(aggregateSum[machineName]))).toFixed(2));
      }
    }

    var returnObject = {};
    returnObject['averageDlp'] = aggregateDlp;
    returnObject['averageCtdi'] = aggregateCtdi;

    res.status(200).send(returnObject);


  })
  .catch(function(err){
    res.status(400).send(err.toString());
  });

})
