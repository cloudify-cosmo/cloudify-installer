var logger = require('log4js').getLogger('listAvailableVersionsCommand');
var actions = require('../lib/actions');
var _ = require('lodash');
var table = require('text-table');
var chalk = require('chalk');
var logSymbols = require('log-symbols');

module.exports = function (cmd, options) {


    var gotResult = false;
    actions.listAvailableVersions(function (err, versions) {
        logger.trace('versions is', versions);
        gotResult = true;
        var output = table(_.map(versions, function (value) {
            return [chalk.cyan(value.id), isNaN(parseInt(value.timestamp)) ? '' :  new Date(value.timestamp), value.source ]
        }));
        console.log(output);
        //logger.info(versions);

        console.log()
    });

    setTimeout(function(){
        if ( !gotResult ) {
            console.log('\n\n\t', logSymbols.info, chalk.blue('fetching versions from pypi'), '\n\n');
        }
    }, 0);


};
