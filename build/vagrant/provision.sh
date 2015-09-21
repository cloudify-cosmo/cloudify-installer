set -x
set -e
set -v


PLATFORM=`python -mplatform | grep Ubuntu && echo "ubuntu" || echo "centos"`



if [ ! -f /usr/bin/node ];then
    echo "installing node"
    NODEJS_VERSION=0.10.35
    NODEJS_HOME=/opt/nodejs
    sudo mkdir -p $NODEJS_HOME
    sudo chown $USER:$USER $NODEJS_HOME
    curl --fail --silent http://nodejs.org/dist/v${NODEJS_VERSION}/node-v${NODEJS_VERSION}-linux-x64.tar.gz -o /tmp/nodejs.tar.gz
    tar -xzf /tmp/nodejs.tar.gz -C ${NODEJS_HOME} --strip-components=1
    sudo ln -s /opt/nodejs/bin/node /usr/bin/node
    sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm
else
    echo "node already installed"
fi


if [ ! -f /usr/bin/git ]; then
    echo "installing git"
    if [ "$PLATFORM" = "ubuntu" ];then
        sudo apt-get install -y git
    else
        sudo yum install -y git
    fi
else
    echo "git already installed"
fi

sudo npm uninstall -g cloudify-installer || echo "no need to uninstall"
## it seems that the "install" script in npm does not work properly when run with vagrant/provision.
## my solution is to disable the script on install and then run it manually.
sudo npm install -g cloudify-cosmo/cloudify-installer#master grunt-cli --ignore-scripts
sudo npm cache clean
sudo /usr/lib/node_modules/cloudify-installer/enable_autocomplete.sh || echo "autocomplete failed"

