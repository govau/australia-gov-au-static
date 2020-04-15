#!/usr/bin/env bash

# Cause a pipeline (for example, curl -s https://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

# see if last merge commit mentioned release- or r00- or r000-
git log --oneline --merges origin/develop | head -n1
git log --oneline --merges origin/develop | head -n1 | grep -E "release-|r[0-9][0-9]([0-9])?"

LAST_MERGED_BRANCH_IS_NOT_RELEASE=$?
if test $LAST_MERGED_BRANCH_IS_NOT_RELEASE -eq 1 # ie. does NOT match == 1 == true
then
 	echo "Last branch merged into develop didn't start with release- so no slack notification"
else
 python3 slack.py --new_develop_deploy $SLACK_CHANNEL
fi
