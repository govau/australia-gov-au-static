#!/usr/bin/env bash

# Path to landing page
INDEX_PAGE="site/public/index.html"
# Get last content commit date in iso8601 format
CONTENT_COMMIT_DATE=$(git log --all -i --grep='content_update' --date=iso --format="%aI" $INDEX_PAGE | head -n1)

# Get last content commit date in readable format
DATE_TEXT=$(git log --all -i --grep='content_update' --date=format-local:"%l:%M%p %Z %A, %d %B %Y" --format="%ad" $INDEX_PAGE | head -n1)

# Generate meta tag to be inserted into HTML page
META_TAG="<meta property="\"og:updated_time\"" content="\"$CONTENT_COMMIT_DATE\"" />"

# Generate HTML tag
DATE_TAG="<p>Updated: $DATE_TEXT<p>"

# sed -i "s@<!--TIME_META-->@$META_TAG@" $INDEX_PAGE
# sed -i "s@<!--LAST_UPDATED_TAG-->@$DATE_TAG@" $INDEX_PAGE

echo "Last update time: $DATE_TEXT"
