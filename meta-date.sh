CURRENT_DATE=$(TZ="Australia/Sydney" date +'%Y-%m-%dT%H:%M:%S%z')
sed -i '' "s:<!--TIME-META-->:$CURRENT_DATE:" site/public/index.html
