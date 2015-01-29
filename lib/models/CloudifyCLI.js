'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var logger = require('log4js').getLogger('CloudifyCLI');

var CloudifyCLI = function() {

    function install(version, options, fnCallback) {
        async.waterfall([
            
            function(callback) {
                if(options.hasOwnProperty('tag')) {
                    notif.info('Download Cloudify CLI ' + options.tag + '...');
                    getCliByTag(options.tag, function(err) {
                        if(err) {
                            notif.faild('Download failed.');
                        }
                        else {
                            notif.ok('Download complete.');
                            notif.info('Installing Cloudify CLI ' + options.tag + '...');
                            installGithubPackage(function(err){
                                if(err) {
                                    notif.faild(err);
                                }
                                else {
                                    notif.ok('Cloudify CLI install complete.');
                                    callback();
                                }
                            });
                        }
                    });
                }
                else if(version === 'nightly') {
                    notif.info('Download Cloudify CLI Nightly...');
                    getCliNightly(function(err){
                        if(err) {
                            notif.faild('Download failed.');
                        }
                        else {
                            notif.ok('Download complete.');
                            notif.info('Installing Cloudify CLI Nightly...');
                            installGithubPackage(function(err){
                                if(err) {
                                    notif.faild('Failed to install Cloudify CLI Nightly.');
                                }
                                else {
                                    notif.ok('Cloudify CLI install complete.');
                                    callback();
                                }
                            });
                        }
                    });
                }
                else {
                    notif.info('Installing Cloudify CLI ' + version + '...');
                    installFromPiPy(version, function(err){
                        if(err) {
                            notif.faild('Cloudify CLI install failed.');
                        }
                        else {
                            notif.ok('Cloudify CLI install complete.');
                            callback();
                        }
                    });
                }
            }

        ], fnCallback);
    }

    /**
     * Install Cloudify-CLI by github tag
     * * * 
     * @param {string} tag - version tag
     * @param {function} callback
     */
    function getCliByTag(tag, callback) {
        var exec = childProcess.spawn('git', ['clone', '--branch', tag, 'https://github.com/cloudify-cosmo/cloudify-cli']);

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
     * Install Cloudify-CLI nightly version
     * * * 
     * @param {function} callback
     */
    function getCliNightly(callback) {
        var exec = childProcess.spawn('git', ['clone', 'https://github.com/cloudify-cosmo/cloudify-cli.git']);

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
     * Install Cloudify-CLI package from PiPy
     * * * 
     * @param {string} version - version number
     * @param {function} callback
     */
    function installFromPiPy(version, callback) {
        var exec = childProcess.spawn('pip', ['install', 'cloudify==' + version]);

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
     * Install Cloudify CLI
     * * *
     * @param {function} callback
     */
    function installGithubPackage(callback) {
        var exec = childProcess.spawn('pip', ['install', '-r', 'cloudify-cli/dev-requirements.txt', '-e', 'cloudify-cli']);

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

module.exports = new CloudifyCLI;