/**
 * runs 'init'
 **/


module.exports = function( opts , callback ){
    run_cmd({'cmd' : 'cfy','args' : ['init']}, callback );
};