'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./notifcations');
var path = require('path');
var fs = require('fs');
//var Buffer = require('buffer');

var Bootstrap = function() {
    
    function start(version, options, fnCallback) {

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
                gitCloneBlueprint(version, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Clone Complete.');
                        callback();
                    }
                });
            },
            
            //function(callback) {
            //    notif.info('Start clone cloudify-manager-blueprints...');
            //    childProcess.exec('git clone --branch ' + version + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', function(error, stdout/*, stderr*/){
            //        if (error !== null) {
            //            notif.faild('exec error: ' + error);
            //        }
            //        else {
            //            //notif.info(stdout);
            //            notif.ok('Clone Complete.');
            //        }
            //        callback();
            //    });
            //},
            
            function(callback) {
                setPrefix(options, callback);
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
                
                var inputs = options.prefix + '.inputs.json';
                var cmd = 'cfy bootstrap -p cloudify-manager-blueprints/openstack/openstack.yaml -i ' + inputs + ' --install-plugins';

                notif.warn(cmd);
                
                notif.info('Bootstraping Cloudify...');
                
                childProcess.exec(cmd, function(error, stdout/*, stderr*/){
                    if (error !== null) {
                        notif.faild(error);
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
    
    function gitCloneBlueprint(version, options, callback) {
        childProcess.exec('git clone --branch ' + version + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', function(error, stdout/*, stderr*/){
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
    
    function setPrefix(options, callback) {
        
        var inputs = require(path.resolve(options.inputs));
        var folder = path.resolve('./');
        var file   = options.prefix + '.inputs.json';
        var fields = [
            "manager_public_key_name",
            "agent_public_key_name",
            "management_network",
            "management_subnet",
            "router",
            "agents_security_group",
            "management_security_group",
            "manager_server_name"
        ];

        notif.info('Set prefix...');
        
        for(var i in inputs) {
            if(fields.indexOf(i) > -1) {
                inputs[i] = options.prefix + '-' + inputs[i];
            }
        }

        inputs['manager_private_key_path'] = '~/.ssh/' + inputs['manager_public_key_name'] + '.pem';
        inputs['agent_private_key_path'] = '~/.ssh/' + inputs['agent_public_key_name'] + '.pem';

        notif.ok('Prefix set successfully.');
        notif.info('Writing inputs with prefix to ' + file + '...');
        
        var buffer = new Buffer(JSON.stringify(inputs, null, 4));
        fs.open(path.resolve(folder, file), 'w+', function(err, fd) {
            if (err) {
                notif.faild('ERROR !! ' + err);
                callback();
            }
            else {
                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) {
                        notif.faild('ERROR !! ' + err);
                        callback();
                    }
                    fs.close(fd, function() {
                        notif.ok(file + ' written success');
                        callback();
                    });
                });
            }
        });
    }
    
    this.start = start;
    
};

module.exports = new Bootstrap;