var fs = require('fs');
var path = require('path');

module.exports = function( version, callback ){
    var versionDir = version.replace('.', '_');
    fs.exists(path.resolve(__dirname, '../', versionDir), function(exists){
        if(exists) {
            var release = require('../' + versionDir);
            if(release.hasOwnProperty('releases') && release.releases.hasOwnProperty('get')) {
                release.releases.get(function(err, records){
                    callback(false, {
                        "records": records
                    });
                });
            }
            else {
                callback(true, {
                    "error": "Version " + version + " exists, but we can't find any data!"
                });
            }
        }
        else {
            callback(true, {
                "error": "Version " + version + " not exists!"
            });
        }
    });
};