#!/usr/bin/env node

var logger = require('log4js').getLogger('index');
var program = require('commander');
var commands = require('./commands');
var tabtab = require('tabtab');




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


program
    .version( packageInfo.version )
    //.option('-v','--version','print version')
    .command('list-available')
    .alias('lsa')
    .description('list available versions')
    .action( commands.listAvailableVersions );
program.parse(process.argv);






