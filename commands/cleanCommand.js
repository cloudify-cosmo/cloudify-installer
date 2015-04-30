'use strict';

var actions = require('../lib/actions');
var logger = require('log4js').getLogger('cleanCommand');
var notif = require('../lib/models').Notifications;

module.exports = function(options) {
    logger.trace('cleaning...');
    actions.clean(options, function(err){
        if(err) {
            notif.faild(err);
            notif.faild('Clean Failed!');
        }
        else {
            notif.ok('Clean successfully!');
        }
    });
};
