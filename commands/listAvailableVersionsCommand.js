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
            return [chalk.cyan(value.id), new Date(value.timestamp)]
        }));
        logger.trace(output);
        //logger.info(versions);

        logger.trace()
    });

    setTimeout(function(){
        if ( !gotResult ) {
            logger.trace('\n\n\t', logSymbols.info, chalk.blue('fetching versions from pypi'), '\n\n');
        }
    }, 0);


};
