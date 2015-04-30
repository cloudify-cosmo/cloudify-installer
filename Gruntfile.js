'use strict';

module.exports = function(grunt) {

    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Load cfy tasks
    require('./tasks/cfy')(grunt);

    // Project configuration.
    grunt.initConfig({
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        fixmyjs: {
            options: {
                // Task-specific options go here.
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js','*.js','tasks/**/*.js','commands/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        jsdoc : {
            dist : {
                src: ['src/*.js', 'test/*.js', 'lib/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        mochacli: {
            options: {
                reporter: 'nyan',
                bail: true
            },
            all: ['test/*.js']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'mochacli']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'mochacli']
            }
        },
        'cfy-install': {
            options: {
                
            },
            staging: {
                options: {
                    version: '3.1',
                    inputs: '/home/itsik/virtualenvs/3.1/inputs.json'
                }
            }
        },
        cfy: {
            'list-available': {
                options: {
                    
                }
            },
            'show-version': {
                options: {

                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['fixmyjs','jshint', 'mochacli']);

    grunt.registerTak('test',['default']);
};