
#deploys the jagadeeshops app
# CI tool should set the below thre environment varibales for trying out the deployment

set -e

: "${SERVER:?SERVER is required and should be non empty. Please set an env variable.}"
: "${USER:?USER is required and should be non empty. Please set an env variable.}"
: "${SSHPASS:?SSHPASS is required and should be non empty. Please set an env variable.}"


# this script will be executed on the remote server. 
#so all inputs to the below script has to be within
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$SERVER 'set -e;
SLEEP_TIME_AFTER_APP_STARTS=10
APPNAME=jagadeeshops
cd mysite;
date;
git pull
pm2 reload jagadeeshops
sleep $SLEEP_TIME_AFTER_APP_STARTS

pm2 list

appstatus=`pm2 info $APPNAME | grep status | head -1`

if [[ $appstatus == *"online"* ]]; then
  echo "Application is running. We can close the deployment now"
else
  echo "application is not running. We need to rollback to the old version"
  exit 100
fi
'
