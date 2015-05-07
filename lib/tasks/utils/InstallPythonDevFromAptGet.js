/**
 * installs `sudo apt-get install python-dev`
 */
module.exports = function( opts, callback ){
    run_cmd({'cmd' : 'apt-get','args' : ['install','python-dev','-y']}, callback );
};