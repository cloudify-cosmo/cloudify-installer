'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./notifcations');

var PreRequired = function() {

    function install(fnCallback) {

        async.waterfall([

            function(callback) {
                notif.info('Start installing python-dev...');
                childProcess.exec('sudo apt-get install python-dev', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('python-dev install complete.');
                    }
                    callback();
                });
            },

            function(callback) {
                notif.info('Start installing build-essential...');
                childProcess.exec('sudo apt-get install build-essential', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('build-essential install complete.');
                    }
                    callback();
                });
            }

        ], fnCallback);

    }

    this.install = install;

};


module.exports = new PreRequired;
