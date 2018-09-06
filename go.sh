#!/usr/bin/env bash

set -euxo pipefail

URL="https://www.australia.gov.au"
# while iterating use a smaller site
# URL="https://docs.cloud.gov.au"

DOMAIN=`expr "$URL" : '^http[s]*://\([^/?]*\)'`

docker build . --tag australia-gov-au-static

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
    --level 5 \
    --page-requisites \
    --adjust-extension \
    --convert-links \
    --restrict-file-names=unix \
    --domains $DOMAIN \
    --no-parent \
    --wait 0 \
    --debug \
    --output-file wget.log \
    --rejected-log wget-rejected.log \
    $URL
ERROR=$?
echo "wget return code: $ERROR"
if [[ $ERROR != 8 ]] ; then
  exit $ERROR
fi
set -e
cat <<EOF > manifest.yml
---
applications:
- name: ${DOMAIN}
  buildpack: staticfile_buildpack
  memory: 64M
  disk_quota: 256M
  path: ${DOMAIN}
EOF

cf push
