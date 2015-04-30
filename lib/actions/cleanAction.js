'use strict';

var notif = require('../models').Notifications;
var clean = require('../models/Clean');

module.exports = function( options, fnCallback ){

    /**
     * Validation of prefix
     */
    if(!options.hasOwnProperty('prefix')) {
        fnCallback('Missing required, Please provide prefix. [e.g.: --prefix <NAME>]');
        return;
    }

    /**
     * Run clean of cloudify installer
     *
     * * *
     * @param {object} options - commander options
     * @param {string} options.prefix - the name of the environment to teardown
     */
    notif.info('Clean cloudify installer');
    clean.start(options, fnCallback);

};
