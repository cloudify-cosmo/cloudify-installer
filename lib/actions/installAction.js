'use strict';

var PreRequire = require('../models').PreRequires;
var CloudifyCLI = require('../models').CloudifyCLI;
var Bootstrap = require('../models').Bootstrap;
var notif = require('../models').Notifications;
var chalk = require('chalk');
var async = require('async');

module.exports = function( version, options, fnCallback ){

    notif.info('Start Install Cloudify...', version);
    
    if(!options.hasOwnProperty('inputs')) {
        fnCallback('Missing required, Please provide inputs. [e.g.: --inputs <PATH>]');
        return;
    }

    if(!options.hasOwnProperty('prefix')) {
        fnCallback('Missing required, Please provide prefix. [e.g.: --prefix <NAME>]');
        return;
    }

    async.waterfall([

        function(callback) {
            PreRequire.install(options, function(err){
                if(err) {
                    callback(err);
                }
                else {
                    callback();
                }
            });
        },

        function(callback) {
            CloudifyCLI.install(options, function(err){
                if(err) {
                    callback(err);
                }
                else {
                    callback();
                }
            });
        },

        function(callback) {
            Bootstrap.start(version, options, function(err, ip){
                if(err) {
                    notif.faild('Bootstrap error: ' + err);
                    callback(err);
                }
                else {
                    notif.info('IP: ' + chalk.blue(ip));
                    callback(null);
                }
            });
        }

    ], fnCallback);

};