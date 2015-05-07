'use strict';


require('../lib/tasks/utils/EasyRunCommand');
var commands = require('../commands');
var actions = require('../lib/actions');
var logger = require('log4js').getLogger('grunt-cfy');
var path = require('path');
var fs = require('fs');
//var cfyShowVersion = require('../lib/actions').showVersion;
//var cfyInstall = require('../lib/actions').install;

module.exports = function (grunt) {

    grunt.registerMultiTask('cfy', 'cloudify-installer', function () {
        var done = this.async();
        var data = this.data;
        try {
            switch (data.cmd) {
                case 'run_script' :

                    if ( this.data.script.indexOf('/') !== 0){
                        this.data.script = path.join(__dirname,'..','scripts', this.data.script );
                    }

                    if ( !fs.existsSync(this.data.script) ){
                        grunt.log.error('script ', this.data.script ,'does not exist');
                        done(false);
                    }
                    // args should have 'options' , 'cmd' and 'args'. see run_cmd
                    run_cmd({
                            'cmd': 'bash',
                            args: [].concat(this.data.script, this.data.args),
                            options: this.data.options
                        },
                        function (e, output) {
                            logger.error('script finished', e, output);
                            done();
                        });
                    break;
                case 'list-available':
                    commands.listAvailableVersions().then(function () {
                        done();
                    });
                    break;
                case 'show-version':
                    logger.trace('executing show version');
                    actions.showVersion(data.version || '3.2', function (err, result) {
                        if (err) {
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
        } catch (e) {
            logger.error('cfy task failed', e);
            throw e;
        }
    });

    grunt.registerMultiTask('cfy-install', 'cloudify-installer install', function () {
        var done = this.async();
        var options = this.options();

        // Chcek for prefix or use target name as default
        if (!options.hasOwnProperty('prefix')) {
            options.prefix = this.target;
        }

        // Check for version
        if (!options.hasOwnProperty('version')) {
            done(false, 'version is missing!');
        }

        // Use virtualenv as default
        if (!options.hasOwnProperty('env')) {
            options.env = true;
        }

        // Install Cloudify
        actions.install(options.version.toString(), options, function (err) {
            done(options.force ? true : err);
        });
    });

};