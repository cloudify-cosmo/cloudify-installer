'use strict';

var notif = require('../models').Notifications;
var teardown = require('../models/Teardown');

module.exports = function( options, fnCallback ){

    /**
     * Validation of prefix
     */
    if(!options.hasOwnProperty('prefix')) {
        fnCallback('Missing required, Please provide prefix. [e.g.: --prefix <NAME>]');
        return;
    }

    /**
     * Run teardown
     */
    notif.info('Teardown cloudify manager');
    teardown.run(options, fnCallback);
    
};
