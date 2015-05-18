var logger = require('log4js').getLogger('EasyRunCommand');
var _ = require('lodash');

/**
 *
 * @param {object} opts
 * @param {string} [opts.name] - optional. the name for the logger. defaults to cmd
 * @param {string} opts.cmd - the commands
 * @param {object} opts.options - not the best name ever.. this is the options you can pass on spawn. https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 * @param {Array<string>} opts.args - args for command
 * @param {function<object>} callback - a callback function that gets a an object with out,err and other info.
 */
function run_cmd( opts, callback ) {
    if ( typeof(opts) !== 'object'){
        callback(new Error('expected opts to be object'));
        return;
    }
    try {
        if ( !callback ){
            callback = function(){};
        }

        if ( !opts.args ){
            opts.args = [];
        }
        logger.trace('running cmd', opts);
        opts.name = opts.name || 'run_cmd [' + (opts.cmd + ' ' + opts.args.join(' ')).substring(0,20) + ']';
        _logger = require('log4js').getLogger(opts.name);
        var spawn = require('child_process').spawn;
        var child = spawn(opts.cmd, opts.args, opts.options);


        function printOutput( fn ){
            var resp = "";
            return function(buffer){
                resp += buffer.toString();
                var args = resp.split('\n');
                _.each(_.compact(_.initial(args) ), function (arg) {
                    fn(arg.trim());
                });
                resp = _.last(args);
            }
        }


        //child.stdout.pipe(process.stdout);
        child.stdout.on('data', printOutput(_logger.info));

        child.stderr.on('data', printOutput(_logger.error));

        //child.stderr.on('data', function (buffer) { resp += buffer.toString(); });
        child.stdout.on('end', function () {
            callback(null, resp);
        });
    } catch (e) {
        callback(e);
    }
} // ()


exports = run_cmd;
global.run_cmd = run_cmd;



if ( require.main === module ){
    logger.info('running main');
    run_cmd( { 'cmd' : 'bash' , args : ['/home/guym/dev_env/projects_GIT/cloudify-cosmo/cloudify-installer/tasks/3.2.0/vagrant_install_simple.sh'] , 'callback' : function(){
        logger.info(arguments);
    }});
    //logger.info('running main');
    //run_cmd( { 'cmd' : 'ls' , args : ['-ll'] , 'callback' : function(){
    //    logger.info(arguments);
    //}});
}