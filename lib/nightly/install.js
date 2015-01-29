'use strict';

var PreRequire = require('../models').PreRequires;
var CloudifyCLI = require('../models').CloudifyCLI;
var GetBlueprint = require('../models').GetBlueprint;
var Bootstrap = require('../models').Bootstrap;
var notif = require('../models').Notifications;
var chalk = require('chalk');
var async = require('async');

var Install = function() {
    
    function start(version, options, fnCallback) {
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
                CloudifyCLI.install(version, options, function(err){
                    if(err) {
                        callback(err);
                    }
                    else {
                        callback();
                    }
                });
            },

            function(callback) {
                GetBlueprint.start(version, options, function(err){
                    if(err) {
                        callback(err);
                    }
                    else {
                        callback();
                    }
                });
            },

            function(callback) {
                Bootstrap.start(options, function(err, ip){
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

    this.start = start;
    
};

module.exports = new Install; // Singleton
