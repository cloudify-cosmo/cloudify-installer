#!/usr/bin/env bash
####
#
# A script to install cloudify using the simple blueprint
#
###

#pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/$TAG.zip -r https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$TAG/dev-requirements.txt

# install pip
sudo yum install wget -y
sudo yum install gcc -y
wget https://bootstrap.pypa.io/get-pip.py && sudo python get-pip.py && sudo yum install python-devel -y && sudo pip install virtualenv

if [ "$SYSTEM_TESTS_VIRTUAL_ENV" == "" ]; then
    export SYSTEM_TESTS_VIRTUAL_ENV=`pwd`/myenv
fi

echo "virtualenv is at: $SYSTEM_TESTS_VIRTUAL_ENV]"
virtualenv $SYSTEM_TESTS_VIRTUAL_ENV && source $SYSTEM_TESTS_VIRTUAL_ENV/bin/activate

## todo: current using master.. will remove this by eov.
export TAG=master

if [ "$TAG" = "" ];then
    pip install cloudify --pre
else
    echo "installing cli from tag $TAG"
    pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/$TAG.zip -r https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$TAG/dev-requirements.txt
fi

cfy init -r


echo -e  'y'|ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ''
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys


DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

## todo: remove once merged
 MANAGER_BRANCH="CFY-3604-use-the-new-ui"

if [ ! -f cloudify-manager-blueprints ]; then
    git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints.git
    if [ "$MANAGER_BRANCH" != "" ];then
        echo "using manager branch $MANAGER_BRANCH"
        cd cloudify-manager-blueprints
        git checkout $MANAGER_BRANCH
        cd ..
    else
        echo "manager branch is empty"
    fi
fi


BLUEPRINT_FILE="`pwd`/cloudify-manager-blueprints/new/simple-manager-blueprint.yaml"

INPUTS_FILE=${DIR}/${USER}_inputs.yaml

if [ ! -f $INPUTS_FILE ];then
    >&2 echo "ERROR: cannot find inputs file $INPUTS_FILE"
    exit 1
fi

cfy bootstrap -v -p $BLUEPRINT_FILE  -i $INPUTS_FILE --install-plugins --keep-up-on-failure

# UI_BLUEPRINT_URL="https://s3.amazonaws.com/cloudify-ui-automations/cloudify-ui-blueprint/builds/3.3/blueprint.tar.gz"
# cfy blueprints publish-archive -l "$UI_BLUEPRINT_URL" -b cloudify-ui -n singlehost.yaml
#cfy deployments create  -b cloudify-ui -d cloudify-ui
#cfy executions start -d cloudify-ui -w install
#sleep 10 # wait for ui to start
#echo finished installing cloudify-ui

# cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.tar.gz -b nodecellar1 -n simple-blueprint.yaml

if [ "$INSTALL_SYSTEM_TESTS_REQ" = "true" ]; then
    cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.tar.gz -b cloudify-ui -n simple-blueprint.yaml
    cfy deployments create -b cloudify-ui -d deployment_to_delete
    cfy deployments create -b cloudify-ui -d installed_deployment
    cfy executions start -w install -d installed_deployment
fi
