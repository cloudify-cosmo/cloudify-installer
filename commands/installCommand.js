'use strict';

var actions = require('../lib/actions');
var logger = require('log4js').getLogger('installCommand');
var notif = require('../lib/models').Notifications;

module.exports = function(version, options) {
    logger.trace('installing...');
    actions.install(version, options, function(err){
        if(err) {
            notif.faild(err);
            notif.faild('Install Failed!');
        }
        else {
            notif.ok('Install Complete!');
        }
    });
};
