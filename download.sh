#!/usr/bin/env bash

# Exit immediately if there is an error
set -e

# Cause a pipeline (for example, curl -s https://sipb.mit.edu/ | grep foo) to produce a failure return code if any command errors not just the last command of the pipeline.
set -o pipefail

# Print shell input lines as they are read.
set -v

URL="https://www.australia.gov.au"

DOMAIN=`expr "$URL" : '^http[s]*://\([^/?]*\)'`

docker build . --tag australia-gov-au-static

pushd site
  # use our own error checking for wget while debugging
  set +e
  docker run -it --rm \
    -v $PWD:/app \
    -v $HOME/.cf:/root/.cf \
    -w /app \
    australia-gov-au-static \
    wget \
      --execute robots=off \
      --recursive \
      --level 20 \
      --page-requisites \
      --adjust-extension \
      --convert-links \
      --reject-regex 'resources-list/resources-list' \
      --restrict-file-names=unix \
      --domains $DOMAIN \
      --max-redirect 0 \
      --no-parent \
      --wait 0 \
      --output-file wget.log \
      --rejected-log wget-rejected.log \
      $URL
  ERROR=$?
  echo "wget return code: $ERROR"
  if [[ $ERROR != 8 ]] ; then
    exit $ERROR
  fi
  set -e

popd
