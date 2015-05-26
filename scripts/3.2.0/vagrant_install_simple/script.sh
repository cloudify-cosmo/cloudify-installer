####
#
# A script to install cloudify using the simple blueprint
#
###

if [ "$APT_GET_UPDATE" = "true" ]; then
    sudo apt-get install update
fi

sudo apt-get install python-pip python-dev -y
sudo pip install virtualenv
virtualenv myenv
source myenv/bin/activate
pip install cloudify --pre
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
    cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.tar.gz -b nodecellar1 -n singlehost-blueprint.yaml
fi

if [ "$INSTALL_SYSTEM_TESTS_SCRIPT" != "" ]; then

    if [ -f "$INSTALL_SYSTEM_TESTS_SCRIPT" ]; then
        source $INSTALL_SYSTEM_TESTS_SCRIPT
    else
        >&2 echo "ERROR: [$INSTALL_SYSTEM_TESTS_SCRIPT] does not exist"
    fi
fi
