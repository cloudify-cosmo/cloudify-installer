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
                            notif.faild(err);
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
                            notif.faild(err);
                        }
                        else {
                            notif.ok('Download complete.');
                            notif.info('Installing Cloudify CLI Nightly...');
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
                else {
                    notif.info('Installing Cloudify CLI ' + version + '...');
                    installFromPiPy(version, function(err){
                        if(err) {
                            notif.faild(err);
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
        childProcess.exec('git clone --branch ' + tag + ' https://github.com/cloudify-cosmo/cloudify-cli', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
    }

    /**
     * Install Cloudify-CLI nightly version
     * * * 
     * @param {function} callback
     */
    function getCliNightly(callback) {
        childProcess.exec('git clone https://github.com/cloudify-cosmo/cloudify-cli.git', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
    }

    /**
     * Install Cloudify-CLI package from PiPy
     * * * 
     * @param {string} version - version number
     * @param {function} callback
     */
    function installFromPiPy(version, callback) {
        childProcess.exec('pip install cloudify==' + version, function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
        
    }
    
    /**
     * Install Cloudify CLI
     * * *
     * @param {function} callback
     */
    function installGithubPackage(callback) {
        childProcess.exec('pip install -r cloudify-cli/dev-requirements.txt -e cloudify-cli', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
    }

    this.install = install;
};

module.exports = new CloudifyCLI;