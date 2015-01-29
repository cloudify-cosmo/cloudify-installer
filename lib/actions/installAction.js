'use strict';

var notif = require('../models').Notifications;
var fs = require('fs');
var path = require('path');

module.exports = function( version, options, fnCallback ){

    if(!version) {
        fnCallback('Missing required, Please provide version. [e.g.: cloudify-installer install <VERSION>]');
        return;
    }
    
    if(!options.hasOwnProperty('inputs')) {
        fnCallback('Missing required, Please provide inputs. [e.g.: --inputs <PATH>]');
        return;
    }

    if(!options.hasOwnProperty('prefix')) {
        fnCallback('Missing required, Please provide prefix. [e.g.: --prefix <NAME>]');
        return;
    }

    /**
     * Returen path of version if exists
     * * * 
     * @param version
     * @param callback
     */
    function getVersion(version, callback) {
        var versionFolder = version.replace('.', '_');
        var versionPath = path.resolve(__dirname, '../', versionFolder);
        
        fs.exists(versionPath, function(exists){
            if(exists) {
                callback(null, versionFolder);
            }
            else {
                callback('Version ' + version + ' not exists!');
            }
        });
    }

    notif.info('Looking for Cloudify ' + version + ' installer...');
    getVersion(version, function(err, folder){
        if(err) {
            fnCallback(err);
        }
        else {
            var installer = require(path.join('../', folder)).install;
            notif.info('Start Install Cloudify...', version);
            installer.start(version, options, fnCallback);
        }
    });

};