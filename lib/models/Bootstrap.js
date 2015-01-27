'use strict';

var childProcess = require('child_process');
var async = require('async');
var notif = require('./Notifcations');
var path = require('path');
var fs = require('fs');
var spinner = require('simple-spinner');

var Bootstrap = function() {

    /**
     * Start bootstrap steps
     * * *
     * @param version - version number
     * @param options - commander options
     * @param fnCallback
     */
    function start(version, options, fnCallback) {

        var config = {
            rootFolder: path.resolve('./'),
            inputsFile: options.prefix + '.inputs.json',
            ipFile: 'manager_ip.txt'
        };
        
        async.waterfall([
            
            function(callback) {
                notif.info('Initialize Cloudify...');
                initialize(options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Initialization successful.');
                        callback();
                    }
                });
            },
            
            function(callback) {
                notif.info('Clone cloudify-manager-blueprints...');
                gitCloneBlueprint(version, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Clone Complete.');
                        callback();
                    }
                });
            },
            
            function(callback) {
                notif.info('Set prefix...');
                setPrefix(options, function(err, inputs) {
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Prefix set successfully.');
                        notif.info('Writing inputs with prefix to ' + config.inputsFile + '...');
                        writeFile(config.inputsFile, config.rootFolder, JSON.stringify(inputs, null, 4), function(err, file) {
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
                injectBlueprintCong(version, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Inject Complete.');
                        callback();
                    }
                });
            },
            
            function(callback) {
                notif.info('Bootstraping Cloudify...');
                bootstrap(config.inputsFile, options, function(err){
                    if(err) {
                        notif.faild(err);
                    }
                    else {
                        notif.ok('Bootstrap Complete.');
                        callback(null);
                    }
                });  
            },

            function(callback) {
                getManagerIp(function(err, ip){
                    notif.info('Writing manager ip address to ' + config.ipFile + '...');
                    writeFile(config.ipFile, config.rootFolder, ip, function(err, file) {
                        if(err) {
                            notif.faild(err);
                        }
                        else {
                            notif.ok(file + ' written success');
                            callback(null, ip);
                        }
                    });
                });
            }
            
        ], fnCallback);
        
    }

    /**
     * Initializing Cloudify
     * * * 
     * @param options - commander options
     * @param callback
     */
    function initialize(options, callback) {
        childProcess.exec('cfy init', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                if(options.verbose) {
                    notif.info(stdout);
                }
                callback(null);
            }
        });
        
    }

    /**
     * Clone blueprint by version
     * * * 
     * @param version - version number
     * @param options - commander options
     * @param callback
     */
    function gitCloneBlueprint(version, options, callback) {
        childProcess.exec('git clone --branch ' + version + ' https://github.com/cloudify-cosmo/cloudify-manager-blueprints', function(error, stdout){
            if (error !== null) {
                callback(error)
            }
            else {
                if(options.verbose) {
                    notif.info(stdout);
                }
                callback(null);
            }
        });
    }

    /**
     * Set prefix on input file and save it as new
     * * 
     * @param options - commander options
     * @param callback
     */
    function setPrefix(options, callback) {
        var inputs = require(path.resolve(options.inputs));
        
        for(var i in inputs) {
            if(typeof(inputs[i]) === 'string') {
                inputs[i] = inputs[i].replace('__prefix__', options.prefix);
            }
        }

        callback(null, inputs);
    }

    /**
     * Write files
     * * * 
     * @param file - file name
     * @param folder - folder location
     * @param content - file content
     * @param callback
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

    /**
     * Inject version config.yaml to the blueprint with our changes
     * * * 
     * @param version
     * @param options
     * @param callback
     */
    function injectBlueprintCong(version, options, callback) {
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
                        if(options.verbose) {
                            notif.info(stdout);
                        }
                        callback(null);
                    }
                });
            }
        });
    }

    /**
     * Bootstraping CLoudify
     * * * 
     * @param inputsFile - path to inputs file
     * @param options - commander option
     * @param callback
     */
    function bootstrap(inputsFile, options, callback) {
        var cmd = 'cfy bootstrap -p cloudify-manager-blueprints/openstack/openstack.yaml -i ' + inputsFile + ' --install-plugins';

        spinner.start();
        childProcess.exec(cmd, function(error, stdout){
            spinner.stop();
            if (error !== null) {
                callback(error)
            }
            else {
                if(options.verbose) {
                    notif.info(stdout);
                }
                callback(null);
            }
        });
    }

    /**
     * Return manager Ip address
     * * * 
     * @param callback
     */
    function getManagerIp(callback) {
        childProcess.exec('cfy status', function(error, stdout){
            var lines = stdout.split("\n");
            var ip = lines[0].match(/\[(.*)\]/gi)[0]
                .replace('[ip=', '')
                .replace(']', '');

            callback(null, ip);

        });
    }
    
    this.start = start;
};

module.exports = new Bootstrap;