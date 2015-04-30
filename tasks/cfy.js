'use strict';


var commands = require('../commands');
var actions = require('../lib/actions');
//var cfyShowVersion = require('../lib/actions').showVersion;
//var cfyInstall = require('../lib/actions').install;

module.exports = function (grunt) {
    
    grunt.registerMultiTask('cfy', 'cloudify-installer', function () {
        var done = this.async();
        var target = this.target;
        var args = this.args;
        
        switch(target) {
            case 'list-available':
                commands.listAvailableVersions();
                done();
                break;
            
            case 'show-version':
                var version = args[0];
                actions.showVersion(version, function(err, result){
                    if(err) {
                        console.log(result.error);
                        done(false);
                    }
                    else {
                        console.log(result.records);
                        done(true);
                    }
                });
                break;
        }
    });

    grunt.registerMultiTask('cfy-install', 'cloudify-installer install', function () {
        var done = this.async();
        var options = this.options();

        // Chcek for prefix or use target name as default
        if(!options.hasOwnProperty('prefix')) {
            options.prefix = this.target;
        }

        // Check for version
        if(!options.hasOwnProperty('version')) {
            done(false, 'version is missing!');
        }
        
        // Use virtualenv as default
        if(!options.hasOwnProperty('env')) {
            options.env = true;
        }

        // Install Cloudify
        actions.install(options.version.toString(), options, function(err){
            done(options.force ? true : err);
        });
    });
    
};