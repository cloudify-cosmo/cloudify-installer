var actions = require('../lib/actions');
var _ = require('lodash');

module.exports = function (cmd/*, options*/) {
    if(_.isString(cmd)) {
        actions.showVersion(cmd, function(err, version){
            if(err) {
                console.error(version.error);
            }
            else {
                console.log(version.records);
            }
        });
    }
    else {
        console.error('Version is missing, please try: cloudify-installer show-version <VERSION>');
    }
};