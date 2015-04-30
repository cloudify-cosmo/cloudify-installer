echo "installing autocomplete for cloudify installer.."
cloudify-installer completion > /etc/bash_completion.d/cloudify-installer || echo 'no completion available for this kind of installation'
echo 'source /etc/bash_completion.d/cloudify-installer' ~/.profile