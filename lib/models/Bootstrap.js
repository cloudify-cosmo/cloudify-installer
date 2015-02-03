'use strict';

var async = require('async');
var notif = require('./Notifcations');
var virtualenv = require('./Virtualenv');
var managerTypes = require('./ManagerTypes');
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
                getManagerIp(options, function(err, ip){
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
     * @param {object} options - commander options
     * @param {function} callback
     */
    function initialize(options, callback) {
        virtualenv.spawn('cfy init', options, callback);
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
     * @param {object} options - commander options
     * @param {function} callback
     */
    function bootstrap(inputsFile, options, callback) {
        var managerDetails = managerTypes.getTypeDetails(options.managerType);
        var mPath = path.join(managerDetails.folder, managerDetails.filename);

        spinner.start();
        virtualenv.spawn('cfy bootstrap -p ' + mPath + ' -i ' + inputsFile + ' --install-plugins', options, function(err){
            spinner.stop();
            callback(err);
        });
    }

    /**
     * Return manager Ip address
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function getManagerIp(options, callback) {
        virtualenv.spawn('cfy status', options, function(error, stdout){
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