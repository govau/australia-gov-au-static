CURRENT_DATE=$(TZ="Australia/Sydney" date +'%Y-%m-%dT%H:%M:%S%z')
DATE_TEXT=$(TZ="Australia/Sydney" date +'%l:%M%p %Z %A, %d %B %Y')
META_TAG="<meta property="\"og:updated_time\"" content="\"$CURRENT_DATE\"" />"
DATE_TAG="<p>$DATE_TEXT<p>"
sed -i '' "s@<!--TIME_META-->@$META_TAG@" site/public/index.html
sed -i '' "s@<!--LAST_UPDATED_TAG-->@$DATE_TAG@" site/public/index.html


