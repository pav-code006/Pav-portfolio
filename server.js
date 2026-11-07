const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Handle CORS Preflight for API
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    });
    res.end();
    return;
  }

  // Handle Contact API: POST /api/contact
  if (req.method === 'POST' && reqPath === '/api/contact') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        let data = {};
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
          data = JSON.parse(body || '{}');
        } else {
          const params = new URLSearchParams(body);
          data = {
            name: params.get('name'),
            email: params.get('email'),
            message: params.get('message'),
            _subject: params.get('_subject'),
          };
        }

        const name = (data.name || '').trim();
        const email = (data.email || '').trim();
        const message = (data.message || '').trim();

        if (!name || !email || !message) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ success: false, error: 'Name, email, and message are required.' }));
          return;
        }

        // Ensure data directory exists
        const dataDir = path.join(ROOT, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        const messagesFile = path.join(dataDir, 'messages.json');
        let messages = [];
        if (fs.existsSync(messagesFile)) {
          try {
            messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8') || '[]');
          } catch (e) {
            messages = [];
          }
        }

        const newMsg = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          name,
          email,
          message,
          ip: req.socket.remoteAddress || req.headers['x-forwarded-for'] || 'local'
        };

        messages.push(newMsg);
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

        console.log(`[Contact Form] Received message from ${name} <${email}>: "${message.slice(0, 60)}..."`);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Accept'
        });
        res.end(JSON.stringify({
          success: true,
          message: 'Your message has been delivered to Pavana! Thank you.',
          id: newMsg.id,
          timestamp: newMsg.timestamp
        }));
      } catch (err) {
        console.error('[Contact Form Error]', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
    });
    return;
  }

  // Handle Contact API: GET /api/messages (Local diagnostics)
  if (req.method === 'GET' && reqPath === '/api/messages') {
    const messagesFile = path.join(ROOT, 'data', 'messages.json');
    let messages = [];
    if (fs.existsSync(messagesFile)) {
      try {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8') || '[]');
      } catch (e) {
        messages = [];
      }
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ count: messages.length, messages }, null, 2));
    return;
  }

  // Static File Serving
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/traffiq' || reqPath === '/traffiq/') reqPath = '/traffiq-demo.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Pavana V Portfolio Server running on port ${PORT}`);
});
