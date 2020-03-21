CURRENT_DATE=$(TZ="Australia/Sydney" date +'%Y-%m-%dT%H:%M:%S%z')
META_TAG="<meta property="\"og:updated_time\"" content="\"$CURRENT_DATE\"" />"
sed -i '' "s@<!--TIME-META-->@$META_TAG@" site/public/index.html

