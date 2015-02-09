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
     * @param options - commander options
     * @param {string} options.inputs - inputs file for bootstrap Cloudify
     * @param {string} options.prefix - prefix use as the virtualenv name 
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
                var fileName = options.inputs.split('/').pop(-1);
                var inputFile = options.prefix + '.' + fileName;
                var inputLoc = options.inputs.split('/');
                    inputLoc.pop();
                    inputLoc = inputLoc.join('/');
                
                notif.info('Bootstraping Cloudify...');
                bootstrap(path.resolve(inputLoc, inputFile), options, function(err){
                    if(err) {
                        notif.faild('Bootstrap failed.');
                    }
                    else {
                        notif.ok('Bootstrap Complete.');
                        callback(null);
                    }
                });  
            },

            function(callback) {
                getManagerIp(options, function(err, ip){
                    notif.info('Writing manager ip address to manager_ip.txt...');
                    fs.writeFile(path.resolve('./manager_ip.txt'), ip, function (err) {
                        if(err) {
                            notif.faild(err);
                        }
                        else {
                            notif.ok('manager_ip.txt written success');
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
     * Parsing cfy status to return manager IP address
     * * * 
     * @descriptions
     * It run 'cfy status' to get the ip of the manager, by parsing the content
     * we split the line to use the first line where we can find the ip address, 
     * the clean it and provide it for the callback.
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function getManagerIp(options, callback) {
        virtualenv.spawn('cfy status', options, function(error, stdout){
            // expecting to get by cfy status the line below:
            // "Getting management services status... [ip=MANAGER_IP_ADDRESS]"
            var ip = stdout.match(/\[ip=(.*)\]/)[1];

            callback(null, ip);
        });
    }
    
    this.start = start;
};

module.exports = new Bootstrap;
