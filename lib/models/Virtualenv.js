'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var path = require('path');
var logger = require('log4js').getLogger('CloudifyCLI');

var Virtualenv = function() {

    /**
     * Initialize virtualenv
     * * *
     * @param {object} options - commander options
     * @param {string} options.prefix - prefix use as the virtualenv name
     * @param {function} fnCallback
     */
    function init(options, fnCallback) {
        if(options.env) {
            async.waterfall([

                function(callback) {
                    notif.info('Initialize virtual environment...')
                    initEnvironment(options.prefix, function(err){
                        if(err) {
                            notif.faild('Initialize failed.');
                        }
                        else {
                            notif.ok('Initialize success.');
                            callback(null);
                        }
                    });
                }

            ], fnCallback);
        }
        else {
            fnCallback(null);
        }
    }

    /**
     * Initialize environment
     * * * 
     * @param {string} env - environment name
     * @param {function} callback
     */
    function initEnvironment(env, callback) {
        spawn('virtualenv ' + env, { env: false }, callback);
    }

    /**
     * Wrap of child_process.spawn to work with virtualenv
     * * *
     * @param {string} cmd - command to execute
     * @param {object} options - commander options
     * @param {string} options.prefix - prefix use as the virtualenv name
     * @param {object} args - arguments for child_process.spawn, for more details please visit child_process documentation
     * @param {function} callback
     * @returns {object} - return child_process.spawn object
     */
    function spawn(cmd, options, args, callback) {
        var stdout;
        var stderr;
        
        if(typeof(args) === 'function') {
            callback = args;
            args = {};
        }
        
        if(options.env && !options.hasOwnProperty('prefix')) {
            callback('please provide prefix');
            return;
        }

        switch(options.env) {
            case true:
                var exec = childProcess.spawn('bash', ['-c', 'source ' + path.resolve(options.prefix) + '/bin/activate; ' + cmd], args || {});
                break;
            
            case false:
                var cmdArgs = cmd.split(' ');
                var cmd = cmdArgs[0];
                cmdArgs.shift();
                var exec = childProcess.spawn(cmd, cmdArgs, args || {});
                break;
        }

        exec.stdout.on('data', function (data) {
            stdout += data;
            logger.trace('stdout: ' + data);
        });

        exec.stderr.on('data', function (data) {
            stderr += data;
            logger.trace('stderr: ' + data);
        });

        exec.on('close', function (code) {
            callback(code !== 0 ? true : null, stdout, stderr);
            exec.stdin.end();
        });
        
        return exec;
    }
    
    this.init = init;
    this.spawn = spawn;

};

module.exports = new Virtualenv;
