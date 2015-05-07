'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        cfy: {
            install: {
                'cmd' : 'run_script',
                'script' : '3.2.0/vagrant_install_simple.sh',
                'args' : [],
                options: {
                    env: {

                    }
                }
            }
        },
        cfyjs: {
            uploadNodecellar: {
                'cmd' : 'blueprint.upload',
                'blueprint_id' : 'nodecellar1',
                'blueprint_path' : 'singlehost-blueprint.yaml'
            }
        }
    });

    grunt.loadNpmTasks('cloudify-installer');
    grunt.registerTask('default', []);

};