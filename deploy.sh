#!/usr/bin/env bash

# Exit immediately if there is an error
set -e

# Cause a pipeline (for example, curl -s http://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

# The git branch we are on
readonly GITBRANCH="$(git symbolic-ref --short -q HEAD)"

# login to cloud foundry if env vars are present
login() {

  if [[ -z "$CF_ORG" ]]; then
    echo "CF env vars not found, assuming you are already logged in to cf"
    return
  fi

  cf api "$CF_API_STAGING"
  cf auth "$CF_USERNAME" "$CF_PASSWORD_STAGING"

  cf target -o "$CF_ORG"
  cf target -s "$CF_SPACE"
}

main() {
  login
  cd site

  # while iterating, its faster to use cf push so we get buildpack caching
  # if uptime becomes more important, change to zero-downtime-push
  #cf zero-downtime-push original-ausgov -f manifest.yml

  case "${GITBRANCH}" in
    master)
      cf push original-ausgov -f manifest.yml
      ;;

    *)
      # uncomment this if you want to push this branch as a separate app
      # Remember to delete the app on cloud.gov.au when you are done
      # cf push original-ausgov-`basename \"${GITBRANCH}\"` -f manifest.yml
      ;;
  esac

}

main $@
