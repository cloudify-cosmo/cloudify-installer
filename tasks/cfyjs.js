'use strict';


var commands = require('../commands');
var actions = require('../lib/actions');
var logger = require('log4js').getLogger('grunt-cfy');
var cfyjs = require('cloudify-js');
//var cfyShowVersion = require('../lib/actions').showVersion;
//var cfyInstall = require('../lib/actions').install;

module.exports = function (grunt) {

    grunt.registerMultiTask('cfyjs', 'cloudify-client', function () {
        //cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/3.2m8.tar.gz -b nodecellar1 -n singlehost-blueprint.yaml
        var done = this.async();
        var opts = this.options({endpoint: 'http://localhost'});
        var data = this.data;
        //var cfyClient = new cfyjs.Client(opts);

        switch(data.cmd) {
            case 'blueprint.upload':
                var req = request.post(url, function (err/*, resp, body*/) { done(!err); });
                var form = req.form();
                form.append('blueprint_id', data.blueprint_id);
                form.append('blueprint_path', data.blueprint_path);
                form.append('file', fs.createReadStream(filepath));
                break;
            default:
                throw new Error('unsupported cmd [' + data.cmd + ']');
        }
    });
};