'use strict';

var chalk = require('chalk');

var Notifications = function() {
    
    function info( content ) {
        console.info('[INFO]', content);
    }
    
    function warning( content ) {
        console.warn('[' +chalk.yellow('WARN') + ']', content);
    }
    
    function success( content ) {
        console.log('[ ' +chalk.green('OK') + ' ]', content);
    }
    
    function faild( content ) {
        console.error('[' +chalk.red('FAIL') + ']', content);
    }
    
    this.info = info;
    this.warn = warning;
    this.ok = success;
    this.faild = faild;
};

module.exports = new Notifications();
