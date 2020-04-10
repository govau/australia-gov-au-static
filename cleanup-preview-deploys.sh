#!/usr/bin/env bash

# Exit immediately if there is an error
set -e

# Cause a pipeline (for example, curl -s https://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

cf login -a $CF_API_STAGING -o $CF_ORG -s $CF_SPACE -u $CF_USERNAME -p $CF_PASSWORD_STAGING

python3 undeploy_closed_branches.py
