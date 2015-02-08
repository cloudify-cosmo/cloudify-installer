'use strict';

var async = require('async');
var notif = require('./Notifcations');
var virtualenv = require('./Virtualenv');
var path = require('path');
var fs = require('fs');

var Clean = function() {

    /**
     * Start clean cloudify installer
     * * *
     * @param {object} options - commander options
     * @param {function} callback
     */
    function start(options, fnCallback) {
        async.waterfall([
            
            function(callback) {
                notif.info('Remove blueprint...');
                removeBlueprint(options, function(err){
                    if(err) {
                        notif.faild('Failed to remove blueprint');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Remove inputs.json file...');
                removeInputs(options, 'json', function(err){
                    if(err) {
                        notif.faild('Failed to remove inputs.json file');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Remove inputs.yaml file...');
                removeInputs(options, 'yaml', function(err){
                    if(err) {
                        notif.faild('Failed to remove inputs.yaml file');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Remove manager_ip.txt...');
                removeManagerIp(options, function(err){
                    if(err) {
                        notif.faild('Failed to remove manager_ip.txt');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Remove .cloudify folder...');
                removeCloudify(options, function(err){
                    if(err) {
                        notif.faild('Failed to remove .cloudify folder');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },
            
            function(callback) {
                notif.info('Remove cloudify-cli folder...');
                removeCLoudifyCli(options, function(err){
                    if(err) {
                        notif.faild('Failed to remove cloudify-cli folder');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            },

            function(callback) {
                notif.info('Remove virtualenv folder...');
                removeVirtualenv(options, function(err){
                    if(err) {
                        notif.faild('Failed to remove virtualenv folder');
                    }
                    else {
                        notif.ok('Remove successfully.');
                        callback();
                    }
                });
            }
            
        ], fnCallback);
    }

    /**
     * Remove blueprint folder
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function removeBlueprint(options, callback) {
        fs.exists(path.resolve('cloudify-manager-blueprints/'), function(exist){
            if(exist) {
                virtualenv.spawn('rm -rf cloudify-manager-blueprints/', options, callback);
            }
            else {
                callback(null);
            }
        });
    }

    /**
     * Remove [prefix].inputs file
     * * *
     * @param {object} options - commander options
     * @param {string} options.prefix - prefix name
     * @param {function} callback
     */
    function removeInputs(options, ext, callback) {
        var inputsFile = options.prefix + '.inputs.' + ext;

        fs.exists(path.resolve(inputsFile), function(exist){
            if(exist) {
                virtualenv.spawn('rm ' + inputsFile, options, callback);
            }
            else {
                callback(null);
            }
        });
    }

    /**
     * Remove manager_ip.txt file
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function removeManagerIp(options, callback) {
        fs.exists(path.resolve('manager_ip.txt'), function(exist){
            if(exist) {
                virtualenv.spawn('rm manager_ip.txt', options, callback);
            }
            else {
                callback(null);
            }
        });
    }

    /**
     * Remove cloudify folder
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function removeCloudify(options, callback) {
        fs.exists(path.resolve('.cloudify/'), function(exist){
            if(exist) {
                virtualenv.spawn('rm -rf .cloudify/', options, callback);
            }
            else {
                callback(null);
            }
        });
    }

    /**
     * Remove cloudify CLI
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function removeCLoudifyCli(options, callback) {
        fs.exists(path.resolve('cloudify-cli/'), function(exist){
            if(exist) {
                virtualenv.spawn('rm -rf cloudify-cli/', options, callback);
            }
            else {
                callback(null);
            }
        });
    }

    /**
     * Remove virtualenv folder
     * * * 
     * @param {object} options - commander options
     * @param {function} callback
     */
    function removeVirtualenv(options, callback) {
        fs.exists(path.resolve(options.prefix), function(exist){
            if(exist) {
                virtualenv.spawn('rm -rf ' + options.prefix + '/', options, callback);
            }
            else {
                callback(null);
            }
        });
    }
    
    this.start = start;
    
};

module.exports = new Clean;