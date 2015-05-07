var _ = require('lodash');
var Release = require('../models').Release;
var request = require('request');
var logger = require('log4js').getLogger('release');

var async = require('async');

/**
 * @class Release
 *
 * @param data
 * @constructor
 */

var Release = function Release(data) {
    _.merge(this, data);

    this.source = 'amazon';

    this.getQuickbuildUrl = function ( callback ) {
        try {
            if (!!data.qb) {
                request.get('http://qb.gsdev.info:8810/rest/ids?configuration_path=' + data.qb.configuration, function (result) {

                    if (!!result) {
                        logger.trace('this is quickbuild result', result, callback);
                        data.qb.url = 'http://qb.gsdev.info:8810/children/' + result;
                    }
                    logger.trace('calling callback');
                });
            }
        }catch(e){
            logger.error('unable to get quickbuild url',e);
        }
        callback();
    };

    this.init = function( callback ){
        this.getQuickbuildUrl(callback);
    };
};

/**
 *
 * @param collection
 */
Release.init = function( collection, callback ){
    if ( !!collection.initialized ){
        callback( null, collection );
        return;
    }

    logger.trace('initializing all');
    async.each(collection, function init(item , callback){
        logger.trace('initializing ' + item.id );
        item.init(callback);
    }, function finishAll (){

        logger.trace('initialized all');
        collection.initialized = true;
        callback( null, collection );

    });
};


module.exports = Release;