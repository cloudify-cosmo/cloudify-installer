'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');

var PreRequired = function() {

    /**
     * Pre required dependencies install steps
     * * * 
     * @param options
     * @param fnCallback
     */
    function install(options, fnCallback) {
        async.waterfall([

            function(callback) {
                notif.info('Installing python-dev...');
                installPythonDev(options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('python-dev install complete.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Installing build-essential...');
                installBuildEssential(options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('build-essential install complete.');
                        callback(null);
                    }
                });
            }

        ], fnCallback);
    }

    /**
     * Install pyhton-dev dependency
     * * * 
     * @param options - commander options
     * @param callback
     */
    function installPythonDev(options, callback) {
        childProcess.exec('sudo apt-get install python-dev', function(error, stdout){
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

    /**
     * INstall build-essential dependency
     * * *
     * @param options - commander options
     * @param callback
     */
    function installBuildEssential(options, callback) {
        childProcess.exec('sudo apt-get install build-essential', function(error, stdout/*, stderr*/){
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


module.exports = new PreRequired;
