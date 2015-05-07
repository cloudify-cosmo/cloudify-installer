/**
 * install virtualenv using `sudo pip install virtualenv`
 */
module.exports = function( opts, callback ){
    run_cmd({'cmd' : 'apt-get', 'args' : ['install','-y','python-pip']}, callback );
};