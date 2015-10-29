#!/usr/bin/env bash
####
#
# A script to install cloudify using the simple blueprint
#
###
if [ "$TAG" = "" ]; then
    export TAG="master"
fi

echo "TAG is $TAG"

if [ "$MANAGER_BRANCH" = "" ]; then
    export MANAGER_BRANCH="$TAG"
fi

echo "MANAGER_BRANCH is $MANAGER_BRANCH"

if [ "$NODECELLAR_BRANCH" = "" ]; then
        export NODECELLAR_BRANCH="$TAG"
    fi

echo "NODECELLAR_BRANCH is $NODECELLAR_BRANCH"

echo "INSTALL_SYSTEM_TESTS_REQ is $INSTALL_SYSTEM_TESTS_REQ"

#pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/$TAG.zip -r https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$TAG/dev-requirements.txt

# install pip
sudo yum install wget -y
sudo yum install gcc -y
#https://raw.githubusercontent.com/pypa/pip/develop/contrib/get-pip.py
wget https://raw.githubusercontent.com/pypa/pip/develop/contrib/get-pip.py && sudo python get-pip.py && sudo yum install python-devel -y && sudo pip install virtualenv

if [ "$SYSTEM_TESTS_VIRTUAL_ENV" == "" ]; then
    export SYSTEM_TESTS_VIRTUAL_ENV=`pwd`/myenv
fi

echo "virtualenv is at: $SYSTEM_TESTS_VIRTUAL_ENV]"
virtualenv $SYSTEM_TESTS_VIRTUAL_ENV && source $SYSTEM_TESTS_VIRTUAL_ENV/bin/activate

## todo: current using 3.3m5.. will remove this by eov.



if [ "$TAG" = "pip" ];then
    pip install cloudify --pre
else
    echo "installing cli from tag $TAG"
    pip install https://github.com/cloudify-cosmo/cloudify-cli/archive/$TAG.zip -r https://raw.githubusercontent.com/cloudify-cosmo/cloudify-cli/$TAG/dev-requirements.txt
fi

echo "TAG is $TAG"

cfy init -r


echo -e  'y'|ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ''
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys


DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )




if [ ! -f cloudify-manager-blueprints ]; then
    git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints.git
    cd cloudify-manager-blueprints
    git checkout $MANAGER_BRANCH
    cd ..
fi


BLUEPRINT_FILE="`pwd`/cloudify-manager-blueprints/new/simple-manager-blueprint.yaml"

if [ "$TYPE" = "" ]; then
    TYPE="plain"
fi

if [ "$TYPE" = "security" ] || [ "$TYPE" = "ssl" ]; then
    export CLOUDIFY_USERNAME=admin #         (or any other username you set as the input value of admin_username)
    export CLOUDIFY_PASSWORD=admin #        (same logic)
fi

if [ "$TYPE"="ssl" ]; then
    export CLOUDIFY_SSL_TRUST_ALL=True #  (if the client supports self-signed certificates)
fi

INPUTS_FILE=${DIR}/manager_${TYPE}_${USER}_inputs.yaml

echo "inputs file is: [$INPUTS_FILE]"

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

    cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/${NODECELLAR_BRANCH}.tar.gz -b nodecellar1 -n simple-blueprint.yaml
    NODECELLAR_INPUTS_FILE=${DIR}/nodecellar_${USER}_inputs.yaml
    cfy blueprints publish-archive -l https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/${NODECELLAR_BRANCH}.tar.gz -b nodecellar_undeployed -n simple-blueprint.yaml
    NODECELLAR_INPUTS_FILE=${DIR}/nodecellar_${USER}_inputs.yaml
    cfy deployments create -b nodecellar1 -d deployment_to_delete --inputs ${NODECELLAR_INPUTS_FILE}
    cfy deployments create -b nodecellar1 -d installed_deployment --inputs ${NODECELLAR_INPUTS_FILE}
    #cfy executions start -w install -d installed_deployment
fi
