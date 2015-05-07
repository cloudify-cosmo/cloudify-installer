var implementations = {
    'pip' : require('./InstallFromPip')
};


var logger = require('log4js').getLogger('tasks.cli.index');

module.exports = function(type){
    if ( implementations.hasOwnProperty(type) ){
        return implementations[type];
    }
    logger.error('type unsupported', type);
};

