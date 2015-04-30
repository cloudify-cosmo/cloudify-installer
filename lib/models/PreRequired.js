'use strict';

var async = require('async');
var notif = require('./Notifcations');
var virtualenv = require('./Virtualenv');
var logger = require('log4js').getLogger('PreRequired');

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
                        notif.faild('Failed to install python-dev');
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
                        notif.faild('Failed to install build-essential');
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
     * @param {function} callback
     */
    function installPythonDev(options, callback) {
        virtualenv.spawn('sudo apt-get install python-dev', options, callback);
    }

    /**
     * Install build-essential dependency
     * * *
     * @param options - commander options
     * @param {function} callback
     */
    function installBuildEssential(options, callback) {
        virtualenv.spawn('sudo apt-get install build-essential', options, callback);
    }

    this.install = install;
};


module.exports = new PreRequired;
