#!/usr/bin/env bash

# Exit immediately if there is an error
set -e

# Cause a pipeline (for example, curl -s https://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

echo "Purging for URL: $1"
curl -sD - -X PURGE -H Fastly-Key:$FASTLY_API_TOKEN -H "Fastly-Soft-Purge:1" $1
