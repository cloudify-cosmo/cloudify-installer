####
#
# A script to install cloudify using the simple blueprint
#
###


## https://bugs.launchpad.net/ubuntu/+source/python-pip/+bug/1468155
sudo apt-get install update
sudo apt-get install python-pip=1.5.4-1 python-dev -y
sudo pip install virtualenv

if [ "$SYSTEM_TESTS_VIRTUAL_ENV" == "" ]; then
    export SYSTEM_TESTS_VIRTUAL_ENV=myenv
fi

virtualenv $SYSTEM_TESTS_VIRTUAL_ENV
source $SYSTEM_TESTS_VIRTUAL_ENV/bin/activate
pip install cloudify==3.2.0
cfy init -r


echo -e  'y'|ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ''
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys


DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

COMMERCIAL_TARZAN_PACKAGE_URL="http://192.168.10.13/builds/GigaSpacesBuilds/cloudify3/3.2.0/m8-RELEASE/cloudify-docker-commercial_3.2.0-m8-b178.tar"

# try to see if tarzan exists. fail after 3 seconds if no response

if curl --max-time 3 --output /dev/null --silent --head --fail "$COMMERCIAL_TARZAN_PACKAGE_URL"; then
  BLUEPRINT_FILE="$DIR/manager_blueprint/blueprint_tarzan_commercial.yaml"
else
  BLUEPRINT_FILE="$DIR/manager_blueprint/blueprint_aws_commercial.yaml"
fi

echo "blueprint file name is $BLUEPRINT_FILE"

INPUTS_FILE=${DIR}/${USER}_inputs.yaml

if [ ! -f $INPUTS_FILE ];then
    >&2 echo "ERROR: cannot find inputs file $INPUTS_FILE"
    exit 1
fi

cfy bootstrap -v -p $BLUEPRINT_FILE  -i $INPUTS_FILE --install-plugins --keep-up-on-failure

if [ "$INSTALL_SYSTEM_TESTS_REQ" = "true" ]; then
    cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.tar.gz -b nodecellar1 -n simple-blueprint.yaml
fi