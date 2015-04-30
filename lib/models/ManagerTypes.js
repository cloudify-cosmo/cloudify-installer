'use strict';

var ManagerType = function() {
    
    function getTypeDetails(type) {
        var details = {
            'cloudstack': {
                folder: 'cloudify-manager-blueprints/cloudstack',
                filename: 'cloudstack.yaml',
                configfile: 'cloudstack.yaml'
            },
            'openstack-docker': {
                folder: 'cloudify-manager-blueprints/openstack-docker',
                filename: 'openstack-docker.yaml',
                configfile: 'openstack-docker.yaml'
            },
            'simple-docker': {
                folder: 'cloudify-manager-blueprints/simple',
                filename: 'simple-docker.yaml',
                configfile: 'simple-docker.yaml'
            },
            'openstack-nova-net': {
                folder: 'cloudify-manager-blueprints/openstack-nova-net',
                filename: 'openstack.yaml',
                configfile: 'openstack-nova-net.yaml'
            },
            'simple': {
                folder: 'cloudify-manager-blueprints/simple',
                filename: 'simple.yaml',
                configfile: 'simple.yaml'
            },
            'openstack': {
                folder: 'cloudify-manager-blueprints/openstack',
                filename: 'openstack.yaml',
                configfile: 'openstack.yaml'
            }
        };
        
        return details[details.hasOwnProperty(type) ? type : 'openstack'];
    }
    
    this.getTypeDetails = getTypeDetails;
};

module.exports = new ManagerType();
