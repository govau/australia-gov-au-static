#!/usr/bin/env bash

# Get commit message of last change to index.html and translate to lowercase
COMMIT_MESSAGE=$(git log -1 --format="%s" site/public/index.html | tr '[:upper:]' '[:lower:]')

# Check commit message to see if it was a content update. If not, do nothing
if [[ $COMMIT_MESSAGE == content_update* ]];
then

  # Generate datetime of last commit to index.html in iso8601 format
  CURRENT_DATE=$(git log -1 --date=iso --format="%aI" site/public/index.html)

  # Generate meta tag to be inserted into HTML page
  META_TAG="<meta property="\"og:updated_time\"" content="\"$CURRENT_DATE\"" />"


  # Generate datetime of last commit to the index.html page
  DATE_TEXT=$(git log -1 --date=format:"%l:%M%p %Z %A, %d %B %Y" --format="%ad" site/public/index.html)

  # Generate HTML tag
  DATE_TAG="<p>Updated: $DATE_TEXT<p>"

  sed -i '' "s@<!--TIME_META-->@$META_TAG@" site/public/index.html
  sed -i '' "s@<!--LAST_UPDATED_TAG-->@$DATE_TAG@" site/public/index.html
#
fi

