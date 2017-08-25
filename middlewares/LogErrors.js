/**
 * Created by alsayed on 3/14/17.
 */

'use strict';
module.exports = function (err, req, res, next) {
    var bunyan = require('bunyan');
    const username = req.user ? req.user.username : '';
    const role = req.user ? req.user.role : '';
    var urlPath = req.path;
    // makes all urls in the following form /path/path/
    const pattern = /\/+\d+\/*/g;
    urlPath = urlPath.replace(pattern, '/');

    // makes url in this form path/path
    const pattern2 = /(^\/+|\/+$)/mg;
    urlPath = urlPath.replace(pattern2, '');

    // replaces underscores with spaces.
    urlPath = urlPath.replace(/_/g, " ");
    let action = urlPath.substr(urlPath.lastIndexOf('/') + 1);
    var log = bunyan.createLogger({
            name: 'error',
            username: username,
            role: role,
            action: action,
            streams: [{
                path: 'error-log.log'
            }
            ],
            level: 'error'
        });
    log.info(err);
    next(err);
};
