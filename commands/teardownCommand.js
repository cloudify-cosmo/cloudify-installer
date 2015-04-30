'use strict';

var actions = require('../lib/actions');
var logger = require('log4js').getLogger('teardownCommand');
var notif = require('../lib/models').Notifications;

module.exports = function(options) {
    actions.teardown(options, function(err){
        if(err) {
            notif.faild(err);
            notif.faild('Teardown Failed!');
        }
        else {
            notif.ok('Teardown successfully!');
        }
    });
};
