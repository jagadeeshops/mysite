
#deploys the jagadeeshops app
# CI tool should set the below thre environment varibales for trying out the deployment

set -e

: "${SERVER:?SERVER is required and should be non empty. Please set an env variable.}"
: "${USERNAME:?USERNAME is required and should be non empty. Please set an env variable.}"
: "${SSHPASS:?SSHPASS is required and should be non empty. Please set an env variable.}"
: "${TRAVIS_BRANCH:?TRAVIS_BRANCH is required and should be non empty. Please set an env variable.}"

if [ "$TRAVIS_BRANCH" = "master" ]
then
	echo "we are in master brach. Attempting to deploy"
else
	echo "we are NOT in master brach. So we wont deploy to production."
	echo "marking deployment as success without deploying actually"
	exit 0
fi


# this script will be executed on the remote server. 
#so all inputs to the below script has to be within
sshpass -e ssh -o StrictHostKeyChecking=no $USERNAME@$SERVER 'set -e;
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
