'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./notifcations');
var path = require('path');

var Bootstrap = function() {
    
    function start(version, inputs, fnCallback) {

        async.waterfall([
            
            function(callback) {
                notif.info('Start initialize Cloudify...');
                childProcess.exec('cfy init', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('Cloudify initialization successful.');
                    }
                    callback();
                });
            },
            
            function(callback) {
                notif.info('Start clone cloudify-manager-blueprints...');
                childProcess.exec('git clone --branch ' + version + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('Clone Complete.');
                    }
                    callback();
                });
            },
            
            function(callback) {

                var config = path.resolve(__dirname, '../3_1/config.yaml');

                notif.info('Copy config file...');
                
                childProcess.exec('cp ' + config + ' cloudify-manager-blueprints/openstack/openstack.yaml', function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                        callback(error);
                    }
                    else {
                        //notif.info(stdout);
                        notif.ok('Copy Complete.');
                    }
                    callback();
                });
                
            },
            
            function(callback) {
                
                
                var cmd = 'cfy bootstrap -p cloudify-manager-blueprints/openstack/openstack.yaml -i ' + inputs + ' --install-plugins';

                notif.warn(cmd);
                
                notif.info('Bootstraping Cloudify...');
                
                childProcess.exec(cmd, function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild('exec error: ' + error);
                        callback(error);
                    }
                    else {
                        notif.info(stdout);
                        callback(null);
                    }
                });
            }
            
        ], fnCallback);
        
    }
    
    this.start = start;
    
};

module.exports = new Bootstrap;