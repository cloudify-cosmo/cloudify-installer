set -x
set -v
set -e

sudo npm -g uninstall cloudify-installer
sudo npm -g install `pwd`