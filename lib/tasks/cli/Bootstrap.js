/**
 * runs bootstrap
 **/


module.exports = function(opts, callback ){
    run_cmd({'cmd' : 'cfy','args': ['bootstrap','']})
}