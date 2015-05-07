/**
 * uses command sudo apt-get install python-pip to install pip
 */
module.exports = function( opts, callback ){
    run_cmd({ 'cmd' : 'apt-get', 'args':[ 'install','python-pip','-y']}, callback );
};