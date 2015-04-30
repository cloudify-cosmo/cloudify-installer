'use strict';

var async = require('async');
var notif = require('./Notifcations');
var virtualenv = require('./Virtualenv');
var managerTypes = require('./ManagerTypes');
var path = require('path');
var fs = require('fs');
var YAML = require('yamljs');
var logger = require('log4js').getLogger('GetBlueprint');


var GetBlueprint = function() {

    /**
     * Download blueprint to install cloudify manager
     * * *
     * @param {string} version - version number
     * @param {object} options - commander options
     * @param {function} fnCallback
     */
    function start(version, options, fnCallback) {
        logger.trace('starting...');
        async.waterfall([

            function(callback) {
                /**
                 * Nightly version points to the master of each rep
                 * and take the latest code which provide the latest milestone
                 */
                if(version === 'nightly') {
                    notif.info('Download cloudify-manager-blueprints Nightly...');
                    gitCloneNightly(options, function(err){
                        if(err) {
                            notif.faild('Download failed.');
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
                    gitCloneByBranch(branch, options, function(err){
                        if(err) {
                            notif.faild('Download failed.');
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
                        var fileName = options.inputs.split('/').pop(-1);
                        var inputFile = options.prefix + '.' + fileName;
                        var inputLoc = options.inputs.split('/');
                            inputLoc.pop();
                            inputLoc = inputLoc.join('/');
                        var content = format === 'JSON' ? JSON.stringify(inputs, null, 4) : YAML.stringify(inputs, null, 4);

                        notif.ok('Prefix set successfully.');
                        notif.info('Writing inputs with prefix to ' + inputFile + '...');
                        fs.writeFile(path.resolve(inputLoc, inputFile), content, function (err) {
                            if(err) {
                                notif.faild(err);
                            }
                            else {
                                notif.ok(inputFile + ' written success');
                                callback();
                            }
                        });
                    }
                });
            },

            function(callback) {
                notif.info('Injecting version config file...');
                injectBlueprintConf(version, options, function(err){
                    if(err) {
                        notif.faild('Inject failed.');
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
     * @param options - commander options
     * @param {function} callback
     */
    function gitCloneByBranch(branch, options, callback) {
        virtualenv.spawn('git clone --branch ' + branch + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', options, callback);
    }

    /**
     * Clone the latest (master) blueprint repo
     * * *
     * @param options - commander options
     * @param {function} callback
     */
    function gitCloneNightly(options, callback) {
        virtualenv.spawn('git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints.git', options, callback);
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

            var inputs;
            var format;
            if(isJson(data)) {
                inputs = JSON.parse(data);
                format = 'JSON'; }
            else if(isYaml(data)) {
                inputs = YAML.parse(data);
                format = 'YAML';
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
     * Inject version openstack.yaml to the blueprint with our changes
     * * *
     * @param {string} version - version number
     * @param options - commander options
     * @param {function} callback
     */
    function injectBlueprintConf(version, options, callback) {
        var versionFolder = version.replace('.', '_');
        var managerDetails = managerTypes.getTypeDetails(options.managerType);
        var mPath = path.join(managerDetails.folder, managerDetails.filename);
        var configFile = path.resolve(__dirname, '../' + versionFolder, managerDetails.configfile);

        fs.exists(configFile, function(exists){
            if(!exists) {
                callback(null);
            }
            else {
                virtualenv.spawn('cp ' + configFile + ' ' + mPath, options, callback);
            }
        });
    }
    
    this.start = start;

};

module.exports = new GetBlueprint();
