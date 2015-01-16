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




if(process.argv.slice(2)[0] === 'completion') return tabtab.complete('cloudify-installer', function(err, data) {
    // simply return here if there's an error or data not provided.
    // stderr not showing on completions
    if(err || !data) return;

    if(/^--\w?/.test(data.last)) return tabtab.log(['help', 'version'], data, '--');
    if(/^-\w?/.test(data.last)) return tabtab.log(['n', 'o', 'd', 'e'], data, '-');

    tabtab.log(['list', 'of', 'commands'], data);
});


var path = require('path');
var packageInfo = require(path.join(__dirname,'package.json'));



function addVerbose(command){
    console.log('add verbose');
    command.option('-v, --verbose', 'verbose', function(){

            console.log('verbose was requested!!');
            log4js.configure({ "appenders" : [
                { "type" : "console" }
            ],levels: {
                '[all]': 'TRACE'
            }});

    }, false);

    _.each(command.commands, addVerbose);
}


program
    .version( packageInfo.version )


    //program//.option('-v','--version','print version')
    program.command('list-available')
    .alias('lsa')

    .description('list available versions')
    .action( commands.listAvailableVersions );

addVerbose(program);



program.parse(process.argv);






