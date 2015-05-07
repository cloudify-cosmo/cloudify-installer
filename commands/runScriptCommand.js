'use strict';
var logger = require('log4js').getLogger('runScriptCommand');
var _ = require('lodash');
var notif = require('../lib/models').Notifications;

module.exports = function() {

    var args = [];
    try {
        console.log(arguments);
        args = [].splice.call(arguments,0, arguments.length-1);
        logger.trace('args',args);
    }catch(e){ }

    var opts = arguments[arguments.length-1];
    args = [].concat(opts.script,args);
    //logger.trace('running script...', arguments);
    run_cmd({ cmd : 'bash', args : args , options : {} }, function(err){
        if ( !!err ) {
            notif.faild(err);
        }
    });
};
