var logger = require('log4js').getLogger('listAvailableVersionsCommand');
var actions = require('../lib/actions');
var _ = require('lodash');
var table = require('text-table');
var chalk = require('chalk');
var logSymbols = require('log-symbols');
var stringLength = require('string-length');

var dateFormat = require('dateformat');

module.exports = function (/*cmd, options*/) {


    var gotResult = false;
    actions.listAvailableVersions(function (err, versions) {
        logger.trace('versions is', versions);
        gotResult = true;

        var headers = [ chalk.underline('version'),chalk.underline('release date'), chalk.underline('source')];
        var lines = _.map(versions, function (value) {
            var releaseDate = '';
            if (!isNaN(parseInt(value.timestamp)) ) {
                releaseDate = dateFormat(new Date(value.timestamp), 'mmm-dd-yyyy');
            }

            return [ chalk.blue(value.id), chalk.white(releaseDate), chalk.white(value.source) ];
        });


        lines = [headers].concat(lines);

        console.log(table(lines, { stringLength : stringLength, align:'l' ,hsep:'\t\t'}));
    });

    setTimeout(function(){
        if ( !gotResult ) {
            console.log('\n\n\t', logSymbols.info, chalk.blue('fetching versions from pypi'), '\n\n');
        }
    }, 0);


};
