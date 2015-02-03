'use strict';

var async = require('async');
var notif = require('./Notifcations');
var virtualenv = require('./Virtualenv');
var logger = require('log4js').getLogger('CloudifyCLI');

var CloudifyCLI = function() {

    /**
     * Start install Cloudify CLI
     * * *
     * @param {string} version - version number
     * @param {object} options - commander options
     * @param {function} fnCallback
     */
    function install(version, options, fnCallback) {
        async.waterfall([
            
            function(callback) {
                if(options.hasOwnProperty('tag')) {
                    notif.info('Download Cloudify CLI ' + options.tag + '...');
                    getCliByTag(options.tag, options, function(err) {
                        if(err) {
                            notif.faild('Download failed.');
                        }
                        else {
                            notif.ok('Download complete.');
                            notif.info('Installing Cloudify CLI ' + options.tag + '...');
                            installGithubPackage(options, function(err){
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
                    getCliNightly(options, function(err){
                        if(err) {
                            notif.faild('Download failed.');
                        }
                        else {
                            notif.ok('Download complete.');
                            notif.info('Installing Cloudify CLI Nightly...');
                            installGithubPackage(options, function(err){
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
                    installFromPiPy(version, options, function(err){
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
     * @param {object} options - commander options
     * @param {function} callback
     */
    function getCliByTag(tag, options, callback) {
        virtualenv.spawn('git clone --branch ' + tag + ' https://github.com/cloudify-cosmo/cloudify-cli', options, callback);
    }

    /**
     * Install Cloudify-CLI nightly version
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function getCliNightly(options, callback) {
        virtualenv.spawn('git clone https://github.com/cloudify-cosmo/cloudify-cli.git', options, callback);
    }

    /**
     * Install Cloudify-CLI package from PiPy
     * * *
     * @param {string} version - version number
     * @param {object} options - commander options
     * @param {function} callback
     */
    function installFromPiPy(version, options, callback) {
        virtualenv.spawn('pip install cloudify==' + version, options, callback);
    }
    
    /**
     * Install Cloudify CLI
     * * *
     * @param {object} options - commander options
     * @param {function} callback
     */
    function installGithubPackage(options, callback) {
        virtualenv.spawn('pip install -r cloudify-cli/dev-requirements.txt -e cloudify-cli', options, callback);
    }

    this.install = install;
};

module.exports = new CloudifyCLI;