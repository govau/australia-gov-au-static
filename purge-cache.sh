#!/usr/bin/env bash

set -euxo pipefail

echo "Purging for URL: $1"
curl -sD - -X PURGE -H Fastly-Key:$FASTLY_API_TOKEN -H "Fastly-Soft-Purge:1" $1
