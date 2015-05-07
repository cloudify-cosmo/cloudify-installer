var logger = require('log4js').getLogger('listAvailableVersionsAction');

var request = require('request');

var _ = require('lodash');
var async = require('async');
var releases = require('..').releases;


function getReleasesFromPypi( callback ){
    request.get('https://pypi.python.org/pypi/cloudify/json', function( data /**, response **/ ){
        if ( typeof(data) === 'string'){
            data = JSON.parse(data);
        }

        var result =  _.map(data.releases, function( value, key ){
            return { 'id' : key, 'source':'pypi', 'timestamp' : new Date(value[0].upload_time).getTime() };
        });

        result = _.sortBy(result, 'timestamp').reverse();
        callback(null, result);
    });
}



function getReleasesFromAmazon( callback ){
    releases.get(callback);
}


module.exports = function( callback ){
    var results = [];
    async.parallel(
        [
            function pypi(callback){
                getReleasesFromPypi(function(err, result){

                   results = results.concat(result);
                    callback();
                });
            },
            function amazon(callback){
                getReleasesFromAmazon(function(err, result){
                    logger.trace('got result from amazon', result );
                    results = results.concat(result);
                    callback();
                });
            }
        ], function(){
            logger.trace('finished everything!');
            callback(null, results);
        }
    );
};