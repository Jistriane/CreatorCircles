const https = require('https');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
// Certificados ficam em /packages/certs (um nível acima do workspace frontend)
const certDir = path.join(__dirname, '..', '..', 'certs');
const keyPath = path.join(certDir, 'localhost.key');
const certPath = path.join(certDir, 'localhost.crt');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('Certificados não encontrados em', certDir);
  console.error('Execute scripts/generate-ssl.sh primeiro.');
  process.exit(1);
}

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

const server = https.createServer(options, (req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/test-wallet.html';
    const safePath = path.normalize(path.join(publicDir, reqPath));
    if (!safePath.startsWith(publicDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      res.writeHead(200, { 'Content-Type': contentType(safePath) });
      fs.createReadStream(safePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3443;
server.listen(PORT, () => {
  console.log(`Servidor HTTPS estático rodando em https://localhost:${PORT}`);
  console.log('Servindo pasta:', publicDir);
});
