
var async = require('async');
var logger = require('log4js').getLogger('index');

exports.actions = require('./actions');

function Releases(){
    this.items = [
        //require('./3_1'),
        require('./3_2').releases
    ];

    this.get = function( callback ){
        logger.trace('getting all releases');
        var results = [];
        async.each(this.items, function(item, callback ){

            item.get( function( err, records ){
                logger.trace('async each',records);
                results = results.concat(records);
                callback();
            });
        }, function(){
            callback(null, results);
        });
    };

}

exports.releases = new Releases();


