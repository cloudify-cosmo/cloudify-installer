'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');

var CloudifyCLI = function() {

    function install(options, fnCallback) {
        async.waterfall([

            function(callback) {
                notif.info('Installing Cloudify CLI...');
                installCloudifyCLI(options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Cloudify CLI install complete.');
                        callback();
                    }
                });
            }

        ], fnCallback);
    }

    /**
     * Install Cloudify CLI
     * * *
     * @param options - commander options
     * @param callback
     */
    function installCloudifyCLI(options, callback) {
        childProcess.exec('pip install cloudify', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                if(options.verbose) {
                    notif.info(stdout);
                }
                callback(null);
            }
        });
    }

    this.install = install;
};

module.exports = new CloudifyCLI;