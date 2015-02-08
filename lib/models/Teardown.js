'use strict';

var virtualenv = require('./Virtualenv');

var Teardown = function() {

    /**
     * Run teardown
     *
     * * *
     * @param {object} options - commander options
     * @param {string} options.prefix - the name of the environment to teardown
     * @param {function} callback 
     */
    function run(options, callback) {
        virtualenv.spawn('cfy teardown -f', options, callback);
    }
    
    this.run = run;
    
};

module.exports = new Teardown;
