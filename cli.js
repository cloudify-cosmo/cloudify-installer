#!/usr/bin/env node


var log4js = require('log4js');
log4js.configure({ "appenders" : [
    { "type" : "console" }
],levels: {
    '[all]': 'INFO'
}});
var program = require('commander');
var commands = require('./commands');
var tabtab = require('tabtab');
var _ = require('lodash');

if ( process.argv.length <= 2 ){
    process.argv.push('-h');
}




if(process.argv.slice(2)[0] === 'completion') {
    return tabtab.complete('cloudify-installer', function (err, data) {
        // simply return here if there's an error or data not provided.
        // stderr not showing on completions
        if (err || !data) { return; }

        if (/^--\w?/.test(data.last)) { return  tabtab.log(['help', 'version', 'verbose'], data, '--'); }
        if (/^-\w?/.test(data.last)) { return  tabtab.log(['h', 'V', 'v'], data, '-'); }

        tabtab.log(['list-available', 'show-version', 'install', 'teardown', 'clean'], data);
    });
}


var path = require('path');
var packageInfo = require(path.join(__dirname,'package.json'));


/**
 * iterate over all commands and subcommands
 * add option 'verbose' with handler to change log level.
 * @param command root of all commands to start walking on and add --verbose option.
 */
function addVerbose(command){ //guy - todo - change with command('*') once bug resolved. see https://github.com/tj/commander.js/issues/314
    command.option('-v, --verbose', 'verbose', function(){
        log4js.configure({
            appenders: [
                {"type" : "console"}
            ],
            levels: {
                '[all]': 'TRACE'
            }
        });
    }, false);
    _.each(command.commands, addVerbose);
}


program
    .version( packageInfo.version );

program.command('list-available')
    .alias('lsa')
    .description('list available versions')
    .action( commands.listAvailableVersions );

program.command('show-version')
    .alias('svr')
    .description('show-version <version>')
    .action( commands.showVersion );

program.command('install <version>')
    .description('install cloudify')
    .option('-n, --no-env', 'install without virtualenv', false, true)
    .option('-i, --inputs <path>', 'provide inputs')
    .option('-p, --prefix <name>', 'define prefix')
    .option('-t, --tag <tag>', 'install tag version from github')
    .option('-m, --manager-type [type]', 'choose which manager type to use for bootstrap, default: openstack')
    .action( commands.install );

program.command('teardown')
    .description('teardown cloudify')
    .option('-p, --prefix [name]', 'define prefix')
    .option('-n, --no-env', 'install without virtualenv', false, true)
    .action( commands.teardown );

program.command('clean')
    .description('clean cloudify installer')
    .option('-p, --prefix [name]', 'define prefix')
    .option('-n, --no-env', 'install without virtualenv', false, true)
    .action( commands.clean );

addVerbose(program); // add --verbose to all commands and subcommands.

program.parse(process.argv);
