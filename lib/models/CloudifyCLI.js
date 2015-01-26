'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./notifcations');

var CloudifyCLI = function() {

    function install(fnCallback) {

        async.waterfall([

            function(callback) {
                notif.info('Start installing Cloudify CLI...');
                childProcess.exec('pip install cloudify', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('Cloudify CLI install complete.');
                    }
                    callback();
                });
            }

        ], fnCallback);

    }

    this.install = install;

};

module.exports = new CloudifyCLI;