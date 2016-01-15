# cloudify-installer

* Master [![Circle CI](https://circleci.com/gh/cloudify-cosmo/cloudify-installer/tree/master.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/cloudify-installer/tree/master)

a node tool to easily install cloudify and other goods


# Installation

```
sudo npm -g install cloudify-cosmo/cloudify-installer
```

 - The library supports auto-complete.
 - We test the library on ubuntu first.
 - You can also use this library as a dependency in your project.

## Autocomplete throws exception?

you can install the module with `--ignore-scripts` to ignore the autocomplete script on install

you can also run bash `enable_autcomplete.sh` from the module's base manually to enable autocomplete.

## Using from grunt

To use this module from grunt you need to do the following

 - install the module
 - add `grunt.loadNpmTasks('cloudify-installer');` - since the module does not have a name starting with `grunt-`
 - add the following configuration to Gruntfile

```
{
 cfy: {
      my_target: {}
  }
}
```

for more details regarding the tasks available, please see `tasks` folder.

# Installing cloudify with simple blueprint with installer

## Using Gruntfile

```js
 cfy: {
     install: {
         'cmd' : 'run_script',
         'script' : '3.3.0/vagrant_install_simple/script.sh',
         'args' : [],
         options: {
             env: {

             }
         }
     }
 },
```
## Using Command-line

to run with default configuration

`cloudify-installer run_script -s 3.3.0/vagrant_install_simple/script.sh`

available customizations

```bash

export TAG="master" # tag for cli. defaults to master
export MANAGER_BRANCH="master" # branch for manager blueprint. defaults to $TAG
export NODECELLAR_BRANCH="master" # branch for nodecellar-example. defaults to $TAG
export INSTALL_SYSTEM_TESTS_REQ="true" # should we setup resources for tests? defaults to ''. if not empty then true.
export TYPE="plain" # plain is the default value. will simply bootstrap cloudify
export TYPE="security" # will enable built in security
export TYPE="ssl" # will enable ssl - also requires security

cloudify-installer run_script -s 3.3.0/vagrant_install_simple/script.sh

```

### Installing 3.2

`cloudify-installer run_script -s 3.2.0/vagrant_install_simple/script.sh`


```js
 cfy: {
     install: {
         'cmd' : 'run_script',
         'script' : '3.2.0/vagrant_install_simple/script.sh',
         'args' : [],
         options: {
             env: {

             }
         }
     }
 },
```

## Commands

See all commands by running `cloudify-installer --help`

# Bootstrapping on DataCentred
### Make sure:
- You have a user on the cloud provider
- You are assigned a tenant with the required resources

### Bootstrapping:
- Install the matching cli version (release vagrant box usually comes with the needed cli)
- Make sure python compilers necessary for openstack modules are installed on the machine:
    `sudo yum install gcc python-devel -y`
- Get the desired manager blueprint on the machine
    `git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints.git && cd cloudify-manager-blueprints && git checkout TAG_NAME`
- DataCentred cloud requires adding dns_nameservers property in the manager blueprint:
    - Add dns_nameservers: [8.8.4.4, 8.8.8.8]
      under node_templates.management_subnet.properties.subnet
      in the blueprint
- Get an input file and fill the required fields.
    - Input file without credentials should look like this:
        ```
        manager_public_key_name: eden-mng-kp-new
        agent_public_key_name: eden-agent-kp-new

        use_existing_manager_keypair: false
        use_existing_agent_keypair: false
        manager_server_name: eden-systemt-cloudify-manager
        ssh_user: centos
        ssh_key_filename: ~/.ssh/eden-mng-kp-new.pem
        agent_private_key_path: ~/.ssh/eden-agent-kp-new.pem
        agents_user: ubuntu
        management_network_name: systemt-cloudify-management-network
        management_subnet_name: systemt-cloudify-management-network-subnet
        management_router: systemt-cloudify-management-router
        manager_security_group_name: systemt-cloudify-sg-manager
        agents_security_group_name: systemt-cloudify-sg-agents
        manager_port_name: systemt-cloudify-manager-port
        resources_prefix: 'eden-'

        # datacentered
        keystone_username: ''
        keystone_password: ''
        keystone_tenant_name: ''
        region: 'sal01'
        keystone_url: https://compute.datacentred.io:5000/v2.0
        external_network_name: external
        flavor_id: 'af2a80fe-ccad-43df-8cae-6418da948467'
        image_id: '74ff4015-aee1-4e02-aaa8-1c77b2650394'
        ```
    - You should fill **keystone_username**,**keystone_password** and **keystone_tenant_name** fields with your credentials
    - Notice that every value that start with 'eden' should be replace to your name.
- Bootstrap!
    `cfy init && cfy bootstrap --install-plugins -p /PATH/TO/MANAGER/BLUEPRINT/FILE -i /PATH/TO/INPUTS/YAML/FILE`


# Different ui tgz file

The cloudify installer can override the inputs field for the webui-url.

simply define environment variable CLOUDIFY_INTALLER_INPUT_WEBUI_SOURCE_URL with the correct value and it will be injected..


# Manual RBAC

To set up a simple authorization example:

1. Set the userstore in "manager-types.yaml" to:

```
    userstore:
        users:
          - username: { get_input: admin_username }
            password: { get_input: admin_password }
            groups:
              - cfy_admins
          - username: viewer
            password: viewer
            roles:
              - viewer
        groups:
          - name: cfy_admins
            roles:
              - administrator
```

2. in "roles_config.yaml" un-comment the viewer role  - see example file under `3.3.0/vagrant_install_simple`

3. in your inputs file set

```
    security_enabled: true
    ssl_enabled: true
```

### Workspace - How to change roles at runtime

 - ssh to machine
 - go to /opt/manager/roles_config.yaml
 - change the file
 - run command `sudo systemctl restart cloudify-restservice` - this will reload the file

