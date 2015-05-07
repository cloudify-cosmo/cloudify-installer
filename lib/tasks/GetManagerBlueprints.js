/**
 * gets manager blueprints to a folder name manager-blueprints
 * @param opts
 * @param callback
 */
module.exports = function(opts, callback){
    // todo - support different version
    run_cmd({'cmd' : 'wget' ,'args' : [ '-O', 'blueprints.tar.gz', 'https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/3.2m8.tar.gz']}, function(){
        run_cmd({'cmd' : 'tar', 'args' : ['-xzvf', 'blueprints.tar.gz']}, function(){
            run_cmd({'cmd' : 'mv' ,'args' : ['cloudify-manager-blueprints-3.2m8','manager-blueprints']}, callback );
        });
    });
};