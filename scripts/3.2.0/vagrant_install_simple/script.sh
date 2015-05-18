####

A script to install cloudify using the simple blueprint

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

ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ''
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys



DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cfy bootstrap -v -p $DIR/manager_blueprint/blueprint_aws_commercial.yaml -i $DIR/inputs.yaml --install-plugins --keep-up-on-failure
