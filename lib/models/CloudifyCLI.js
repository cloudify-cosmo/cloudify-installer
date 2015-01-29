'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');

var CloudifyCLI = function() {

    function install(version, options, fnCallback) {
        async.waterfall([
            
            function(callback) {
                notif.info('Clone Cloudify CLI ' + version + '...');
                gitCloneCloudifyCLI(version, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Clone complete.');
                        callback();
                    }
                });
                
            },

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
     * Clone Cloudify CLI from github
     * * *
     * @param version - version number
     * @param options - commander options
     * @param callback
     */
    function gitCloneCloudifyCLI(version, options, callback) {
        switch(version) {
            case 'nightly':
                var cmd = 'git clone https://github.com/cloudify-cosmo/cloudify-cli.git';
                break;
            
            default:
                var cmd = 'git clone --branch ' + version + ' https://github.com/cloudify-cosmo/cloudify-cli';
        }
        
        childProcess.exec(cmd, function(error, stdout){
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
     * Install Cloudify CLI
     * * *
     * @param options - commander options
     * @param callback
     */
    function installCloudifyCLI(options, callback) {
        childProcess.exec('pip install -r cloudify-cli/dev-requirements.txt -e cloudify-cli', function(error, stdout){
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