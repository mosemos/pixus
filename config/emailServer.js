/**
 * Created by alsayed on 4/30/17.
 */
var emailServer = {};
var nodemailer = require('nodemailer');

var service = require(__dirname + '/config.json').emailService;
var email = require(__dirname + '/config.json').serverEmail;
var password = require(__dirname + '/config.json').serverEmailPassword;

var smtpTransport = nodemailer.createTransport({
    service: service,
    auth: {
        user: email,
        pass: password
    }
});

var mailOptions={};

emailServer.smtpTransport = smtpTransport;
emailServer.mailOptions = mailOptions;

module.exports = emailServer;
