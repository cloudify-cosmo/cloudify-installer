'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var path = require('path');
var fs = require('fs');
var spinner = require('simple-spinner');
var logger = require('log4js').getLogger('Bootstrap');

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
                initialize(function(err){
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
                bootstrap(inputFile, function(err){
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
     * @param {function} callback
     */
    function initialize(callback) {
        var exec = childProcess.spawn('cfy', ['init']);

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
     * Write files
     * * * 
     * @param {string} file - file name
     * @param {string} folder - folder location
     * @param {string} content - file content
     * @param {function} callback
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
     * @param {string} inputsFile - path to inputs file
     * @param {function} callback
     */
    function bootstrap(inputsFile, callback) {
        spinner.start();

        var exec = childProcess.spawn('cfy', ['bootstrap', '-p', 'cloudify-manager-blueprints/openstack/openstack.yaml', '-i', inputsFile, '--install-plugins']);

        exec.stdout.on('data', function (data) {
            logger.trace('stdout: ' + data);
        });

        exec.stderr.on('data', function (data) {
            logger.trace('stderr: ' + data);
        });

        exec.on('close', function (code) {
            spinner.stop();
            callback(code !== 0 ? true : null);
            exec.stdin.end();
        });
    }

    /**
     * Return manager Ip address
     * * * 
     * @param {function} callback
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