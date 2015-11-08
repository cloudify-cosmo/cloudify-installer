set -evx


PLATFORM=`python -mplatform | grep Ubuntu && echo "ubuntu" || echo "centos"`

if [ ! -f /usr/bin/node ]; then
   set +evx &&  ( curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.27.1/install.sh | bash  )  && source ~/.bashrc && nvm install 0.10.35 && nvm alias default 0.10.35 && n=$(which node);n=${n%/bin/node}; sudo ln -s $n/bin/node /usr/bin/node; sudo ln -s $n/bin/npm /usr/bin/npm && set -evx ;
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

export INSTALL_SYSTEM_TESTS_REQ="true"
export TAG="master"
# export MANAGER_BRANCH="CFY-3766-manager-accesible-through-port-80-even-if-SSL-enabled"
export TYPE="ssl"
cloudify-installer run_script -s 3.3.0/vagrant_install_simple/script.sh

