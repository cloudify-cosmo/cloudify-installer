'use strict';
var notif = require('../lib/models').Notifications;
var path = require('path');

module.exports = function() {

    var args = [];
    try {
        args = [].splice.call(arguments,0, arguments.length-1);
    }catch(e){ }

    var opts = arguments[arguments.length-1];
    var script = opts.script;
    if ( script.indexOf('/') !== 0 ){
        script = path.join(__dirname, '..', 'scripts', script);
    }
    args = [].concat(script,args);
    //logger.trace('running script...', arguments);
    run_cmd({ cmd : 'bash', args : args , options : {} }, function(err){
        if ( !!err ) {
            notif.faild(err);
        }
    });
};
