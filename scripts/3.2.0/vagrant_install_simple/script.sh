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
cfy init


echo -e  'y\n'|ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ''
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

cfy bootstrap -v -p $BLUEPRINT_FILE  -i $DIR/inputs.yaml --install-plugins --keep-up-on-failure
