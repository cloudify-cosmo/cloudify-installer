'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var path = require('path');
var fs = require('fs');
var spinner = require('simple-spinner');

var Bootstrap = function() {

    /**
     * Start bootstrap steps
     * * *
     * @param version - version number
     * @param options - commander options
     * @param fnCallback
     */
    function start(options, fnCallback) {
        
        async.waterfall([
            
            function(callback) {
                notif.info('Initialize Cloudify...');
                initialize(options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Initialization successful.');
                        callback();
                    }
                });
            },
            
            function(callback) {
                var inputFile = options.prefix + '.' + options.inputs;
                
                notif.info('Bootstraping Cloudify...');
                bootstrap(inputFile, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Bootstrap Complete.');
                        callback(null);
                    }
                });  
            },

            function(callback) {
                getManagerIp(function(err, ip){
                    var rootFolder = path.resolve('./');
                    var ipFile = 'manager_ip.txt';
                    
                    notif.info('Writing manager ip address to ' + ipFile + '...');
                    writeFile(ipFile, rootFolder, ip, function(err, file) {
                        if(err) {
                            notif.faild(err);
                        }
                        else {
                            notif.ok(file + ' written success');
                            callback(null, ip);
                        }
                    });
                });
            }
            
        ], fnCallback);
        
    }

    /**
     * Initializing Cloudify
     * * * 
     * @param options - commander options
     * @param callback
     */
    function initialize(options, callback) {
        childProcess.exec('cfy init', function(error, stdout){
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
     * Write files
     * * * 
     * @param file - file name
     * @param folder - folder location
     * @param content - file content
     * @param callback
     */
    function writeFile(file, folder, content, callback) {
        var buffer = new Buffer(content);
        
        fs.open(path.resolve(folder, file), 'w+', function(err, fd) {
            if (err) {
                callback(err);
            }
            else {
                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) {
                        callback(err);
                    }
                    fs.close(fd, function() {
                        callback(null, file);
                    });
                });
            }
        });
    }

    /**
     * Bootstraping Cloudify
     * * * 
     * @param inputsFile - path to inputs file
     * @param options - commander option
     * @param callback
     */
    function bootstrap(inputsFile, options, callback) {
        var cmd = 'cfy bootstrap -p cloudify-manager-blueprints/openstack/openstack.yaml -i ' + inputsFile + ' --install-plugins';

        spinner.start();
        childProcess.exec(cmd, function(error, stdout){
            spinner.stop();
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
     * Return manager Ip address
     * * * 
     * @param callback
     */
    function getManagerIp(callback) {
        childProcess.exec('cfy status', function(error, stdout){
            var lines = stdout.split("\n");
            var ip = lines[0].match(/\[(.*)\]/gi)[0]
                .replace('[ip=', '')
                .replace(']', '');

            callback(null, ip);

        });
    }
    
    this.start = start;
};

module.exports = new Bootstrap;