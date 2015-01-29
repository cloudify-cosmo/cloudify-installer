'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var path = require('path');
var fs = require('fs');
var YAML = require('yamljs');
var logger = require('log4js').getLogger('GetBlueprint');


var GetBlueprint = function() {
    
    function start(version, options, fnCallback) {

        async.waterfall([

            function(callback) {
                if(version === 'nightly') {
                    notif.info('Download cloudify-manager-blueprints Nightly...');
                    gitCloneNightly(function(err){
                        if(err) {
                            notif.faild(err);
                        }
                        else {
                            notif.ok('Download Complete.');
                            callback();
                        }
                    });
                }
                else {
                    var branch = options.hasOwnProperty('tag') ? options.tag : version;
                    
                    notif.info('Download cloudify-manager-blueprints ' + branch + '...');
                    gitCloneByBranch(branch, function(err){
                        if(err) {
                            notif.faild(err);
                        }
                        else {
                            notif.ok('Download Complete.');
                            callback();
                        }
                    });
                }
            },

            function(callback) {
                notif.info('Set prefix...');
                setPrefix(options, function(err, inputs, format) {
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        var inputFile = options.prefix + '.' + options.inputs;
                        var rootFolder = path.resolve('./');
                        var content = format === 'JSON' ? JSON.stringify(inputs, null, 4) : YAML.stringify(inputs, null, 4);

                        notif.ok('Prefix set successfully.');
                        notif.info('Writing inputs with prefix to ' + inputFile + '...');
                        writeFile(inputFile, rootFolder, content, function(err, file) {
                            if(err) {
                                notif.faild(err);
                            }
                            else {
                                notif.ok(file + ' written success');
                                callback();
                            }
                        });
                    }
                });
            },

            function(callback) {
                notif.info('Injecting version config file...');
                injectBlueprintConf(version, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Inject Complete.');
                        callback();
                    }
                });
            }
            
        ], fnCallback);
    }

    /**
     * Clone blueprint repo by branch / tag
     * * * 
     * @param {string} branch - branch / tag name
     * @param {function} callback
     */
    function gitCloneByBranch(branch, callback) {
        childProcess.exec('git clone --branch ' + branch + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
    }

    /**
     * Clone the latest (master) blueprint repo
     * * *
     * @param {function} callback
     */
    function gitCloneNightly(callback) {
        childProcess.exec('git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints.git', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                logger.trace(stdout);
                callback(null);
            }
        });
    }

    /**
     * Set prefix on input file and save it as new
     * *
     * @param {object} options - commander options
     * @param {string} options.inputs - relative inputs file location 
     * @param {function} callback
     */
    function setPrefix(options, callback) {
        var file = path.resolve(options.inputs);
        
        fs.readFile(file, "utf-8", function(err, data) {
            if(err) {
                callback(err);
                return;
            }

            if(isJson(data)) {
                var inputs = JSON.parse(data);
                var format = 'JSON';
            }
            else if(isYaml(data)) {
                var inputs = YAML.parse(data);
                var format = 'YAML';
            }
            else {
                callback('Inputs are not valid!');
            }

            for(var i in inputs) {
                if(typeof(inputs[i]) === 'string') {
                    inputs[i] = inputs[i].replace('__prefix__', options.prefix);
                }
            }

            callback(null, inputs, format);
        });
    }

    /**
     * Check if string is JSON
     * * * 
     * @param {string} str - string to check
     * @returns {boolean}
     */
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Check if string is YAML
     * * *
     * @param {string} str - string to check
     * @returns {boolean}
     */
    function isYaml(str) {
        try {
            YAML.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Inject version config.yaml to the blueprint with our changes
     * * *
     * @param {string} version - version number
     * @param {function} callback
     */
    function injectBlueprintConf(version, callback) {
        var versionFolder = version.replace('.', '_');
        var configFile = path.resolve(__dirname, '../' + versionFolder + '/config.yaml');

        fs.exists(configFile, function(exists){
            if(!exists) {
                callback(null);
            }
            else {
                childProcess.exec('cp ' + configFile + ' cloudify-manager-blueprints/openstack/openstack.yaml', function(error, stdout){
                    if (error !== null) {
                        callback(error);
                    }
                    else {
                        logger.trace(stdout);
                        callback(null);
                    }
                });
            }
        });
    }

    /**
     * Write files
     * * *
     * @param {string} file - file name
     * @param {string} folder - folder location
     * @param {string} content - file content
     * @param {function} callback
     */
    function writeFile(file, folder, content, callback) {
        var buffer = new Buffer(content);

        fs.open(path.resolve(folder, file), 'w+', function(err, fd) {
            if (err) {
                callback(err);
            }
            else {
                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) {
                        callback(err);
                    }
                    fs.close(fd, function() {
                        callback(null, file);
                    });
                });
            }
        });
    }
    
    this.start = start;
    this.setPrefix = setPrefix;
    this.writeFile = writeFile;

};

module.exports = new GetBlueprint;
