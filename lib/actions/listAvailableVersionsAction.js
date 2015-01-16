var httpClient = require('node-rest-client').Client;
httpClient = new httpClient();

var _ = require('lodash');


module.exports = function( callback ){
    httpClient.get('https://pypi.python.org/pypi/cloudify/json', function( data /**, response **/ ){
        if ( typeof(data) === 'string'){
            data = JSON.parse(data);
        }

        var result =  _.map(data.releases, function( value, key ){
            return { 'id' : key, 'timestamp' : new Date(value[0].upload_time).getTime() };
        });
        result = _.sortBy(result, 'timestamp').reverse();
        callback(result);
    });
};