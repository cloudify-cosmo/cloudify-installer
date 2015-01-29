'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
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
                installPythonDev(function(err){
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
                installBuildEssential(function(err){
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
     * @param callback
     */
    function installPythonDev(callback) {
        var exec = childProcess.spawn('sudo', ['apt-get', 'install', 'python-dev']);

        exec.stdout.on('data', function (data) {
            logger.trace('stdout: ' + data);
        });

        exec.stderr.on('data', function (data) {
            logger.trace('stderr: ' + data);
        });

        exec.on('close', function (code) {
            callback(code !== 0 ? true : null);
            exec.stdin.end();
        });
    }

    /**
     * Install build-essential dependency
     * * *
     * @param options - commander options
     * @param callback
     */
    function installBuildEssential(callback) {
        var exec = childProcess.spawn('sudo', ['apt-get', 'install', 'build-essential']);

        exec.stdout.on('data', function (data) {
            logger.trace('stdout: ' + data);
        });

        exec.stderr.on('data', function (data) {
            logger.trace('stderr: ' + data);
        });

        exec.on('close', function (code) {
            callback(code !== 0 ? true : null);
            exec.stdin.end();
        });
    }

    this.install = install;
};


module.exports = new PreRequired;
