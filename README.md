# australia-gov-au-static 

[![CircleCI](https://circleci.com/gh/govau/australia-gov-au-static.svg?style=svg)](https://circleci.com/gh/govau/australia-gov-au-static)

Static site for www.australia.gov.au.

## Download the old site

`wget` in the included docker image was used to download the old site using the [download.sh](./download.sh) script.

## Modifications

## Modify the html

[modify.py](./modify.py) was used to tweak the downloaded files to fix up issues and convert the site to static.

Originally it was thought that modify.py could be run in CI against the repo, and the output deployed (and not checked in). However this approach was too slow, so now the changes should be committed into the repo, and CI will just deploy what is in the repo.

## Deployment

CI watches for changes in the `develop` branch and pushes to: https://original-ausgov.apps.y.cld.gov.au/. 
The `master` branch deploys to: https://www.australia.gov.au whenever the CDN refreshes its cache, presumably 3600 seconds.
