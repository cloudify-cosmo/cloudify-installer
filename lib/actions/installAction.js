'use strict';

var PreRequire = require('../models').PreRequires;
var CloudifyCLI = require('../models').CloudifyCLI;
var Bootstrap = require('../models').Bootstrap;
var notif = require('../models').Notifications;
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
            PreRequire.install(function(){
                notif.ok('Cloudify Pre-Install Complete.');
                callback();
            });
        },

        function(callback) {
            CloudifyCLI.install(function(){
                notif.ok('Install Cloudify CLI Complete.');
                callback();
            });
        },

        function(callback) {
            Bootstrap.start(version, options, function(err){
                if(err) {
                    notif.faild('Bootstrap error: ' + err);
                    callback(err);
                }
                else {
                    notif.ok('Bootstrap Complete.');
                    callback();
                }
            });
        }

    ], fnCallback);

};