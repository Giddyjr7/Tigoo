const https = require('https');

https.get('https://ep-small-dew-asbun3wu.neonauth.c-4.eu-central-1.aws.neon.tech/neondb/auth/.well-known/jwks.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
