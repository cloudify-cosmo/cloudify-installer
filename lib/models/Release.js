var _ = require('lodash');
var Release = require('../models').Release;
var httpClient = require('node-rest-client').Client;
httpClient = new httpClient();
var logger = require('log4js').getLogger('release');

var async = require('async');

/**
 * @class Release
 *
 * @param data
 * @constructor
 */

function Release(data) {
    _.merge(this, data);

    this.getQuickbuildUrl = function ( callback ) {
        try {
            if (!!data.qb) {
                httpClient.get('http://qb.gsdev.info:8810/rest/ids?configuration_path=' + data.qb.configuration, function (result) {
                    if (!!result) {
                        console.log('this is quickbuild result', result);
                        data.qb.url = 'http://qb.gsdev.info:8810/children/' + result;
                    }
                    callback();
                });
            }
        }catch(e){
            logger.error('unable to get quickbuild url',e);
        }
    };

    this.init = function( callback ){
        this.getQuickbuildUrl(callback);
    };
}

/**
 *
 * @param collection
 */
Release.init = function( collection, callback ){
    if ( !!collection.initialized ){
        callback( null, collection );
    }

    async.each(collection, function init(item , callback){
        item.init(callback);
    }, function finishAll (){
        collection.initialized = true;
        callback( null, collection );

    });
};


module.exports = Release;