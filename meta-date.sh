#!/usr/bin/env bash
# Generate meta tag for last updated date
CURRENT_DATE=$(TZ="Australia/Sydney" date +'%Y-%m-%dT%H:%M:%S%z')
META_TAG="<meta property="\"og:updated_time\"" content="\"$CURRENT_DATE\"" />"

# Generate HTML tag for last updated date
DATE_TEXT=$(TZ="Australia/Sydney" date +'%l:%M%p %Z %A, %d %B %Y')
DATE_TAG="<p>Updated: $DATE_TEXT<p>"

sed -i '' "s@<!--TIME_META-->@$META_TAG@" site/public/index.html
sed -i '' "s@<!--LAST_UPDATED_TAG-->@$DATE_TAG@" site/public/index.html


