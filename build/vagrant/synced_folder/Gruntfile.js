'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        cfy: {
            install: {
                'cmd' : 'run_script',
                'script' : '3.2.0/vagrant_install_simple/script.sh',
                'args' : [],
                options: {
                    env: {

                    }
                }
            }
        }
    });


    grunt.loadNpmTasks('cloudify-installer');
    grunt.registerTask('default', []);

};