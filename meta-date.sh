CURRENT_DATE=$(date +‘%d/%m/%Y’)
sed -i '' "s:<!--TIME-META-->:$CURRENT_DATE:" site/public/index.html
