var fs = require('fs');


fs.readFile( __dirname + '/site/public/index.html', 'utf-8', (err, data) => {
  if( err ){
    console.error( err);
    return;
  }

  const currentTime = new Date();
  const metaTimeTag = `<meta property="og:updated_time" content="${currentTime}" />`
  const html = data.replace(`<!--TIME META-->`, metaTimeTag )
  fs.writeFile( __dirname + '/site/public/index.html', html );
})

