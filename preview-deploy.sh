#!/usr/bin/env bash

# Exit immediately if there is an error
set -e

# Cause a pipeline (for example, curl -s https://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

cf login -a $CF_API_STAGING -o $CF_ORG -s $CF_SPACE -u $CF_USERNAME -p $CF_PASSWORD_STAGING

cp config/stag_manifest.yml site/manifest.yml
cd site
GITBRANCH="$(git symbolic-ref --short -q HEAD)"
APPNAME=preview-ausgov-`basename $GITBRANCH`
cf app $APPNAME > /dev/null
APP_NEW=$?

cf push $APPNAME -f manifest.yml

cd "../"
if test $APP_NEW -eq 1 # ie. does NOT exist == 1 == true
then
 python3 slack.py --new_preview $APPNAME
else
	echo "$APPNAME already existed so no need for slack notification"
fi
