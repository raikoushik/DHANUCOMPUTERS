const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { prepareApp } = require('./app');

const PORT = Number(process.env.PORT || 3000);
const keyPath = path.join(__dirname, '..', 'certs', 'dev-key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'dev-cert.pem');

(async () => {
  const app = await prepareApp();

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const credentials = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    https.createServer(credentials, app).listen(PORT, () => {
      console.log(`HTTPS enabled on https://localhost:${PORT}`);
    });
  } else {
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP enabled on http://localhost:${PORT}`);
      console.log('Dev tip: run npm run gen:cert to enable HTTPS locally.');
    });
  }
})();
