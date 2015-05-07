/**
 * installs the cli from : https://raw.githubusercontent.com/cloudify-cosmo/cloudify-packager/master/package-configuration/linux-cli/get-cloudify.py
 */
module.exports = function( opts, callback ){
    run_cmd({ 'cmd' : 'pip', args: ['install', 'cloudify', '--pre']}, callback);
};