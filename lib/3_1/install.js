'use strict';

var Virtualenv = require('../models').Virtualenv;
var PreRequire = require('../models').PreRequires;
var CloudifyCli = require('../models').CloudifyCli;
var GetBlueprint = require('../models').GetBlueprint;
var Bootstrap = require('../models').Bootstrap;
var notif = require('../models').Notifications;
var chalk = require('chalk');
var async = require('async');

var Install = function() {

    function start(version, options, fnCallback) {
        async.waterfall([
            
            function(callback) {
                Virtualenv.init(options, function(err){
                    if(err) {
                        callback(err);
                    }
                    else {
                        callback();
                    }
                });
            },

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
                CloudifyCli.install(version, options, function(err){
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
    }

    this.start = start;

};

module.exports = new Install(); // Singleton
