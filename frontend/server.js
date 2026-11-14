/**
 * Production static server for the IncuxAI frontend.
 *
 * Why this exists:
 * Railway/Nixpacks boots the container with a start command. `vite build` only
 * produces `dist/` and then exits, so the container died and every request
 * returned 502 Bad Gateway. This process stays alive, serves `dist/`, and can
 * proxy `/api` to the backend service so the browser talks to a single origin
 * (no CORS, no localhost URLs baked into the bundle).
 *
 * Zero dependencies on purpose: fast cold start, nothing to install.
 */
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Backend origin used for same-origin /api requests.
// Override with API_PROXY_TARGET on Railway (private URL preferred,
// e.g. http://backend.railway.internal:5000). The public URL is the fallback
// so the frontend works without extra configuration.
const API_TARGET = (
  process.env.API_PROXY_TARGET ||
  process.env.BACKEND_URL ||
  'https://steadfast-beauty-production-458e.up.railway.app'
).replace(/\/+$/, '');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const COMPRESSIBLE = new Set([
  '.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.map', '.webmanifest',
]);

function isCompressible(file) {
  return COMPRESSIBLE.has(path.extname(file).toLowerCase());
}

function sendCompressed(req, res, file, status = 200) {
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';

  // Hashed build assets never change; everything else must revalidate.
  const immutable = file.startsWith(path.join(DIST, 'assets')) || file.startsWith(path.join(DIST, 'images'));
  const cacheControl = immutable
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';

  const headers = {
    'Content-Type': type,
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
  };

  if (!isCompressible(file)) {
    const stat = fs.statSync(file);
    headers['Content-Length'] = stat.size;
    res.writeHead(status, headers);
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(file).pipe(res);
  }

  const accept = String(req.headers['accept-encoding'] || '');
  const encoding = accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gzip' : null;
  const raw = fs.readFileSync(file);

  const body = encoding === 'br'
    ? zlib.brotliCompressSync(raw)
    : encoding === 'gzip'
      ? zlib.gzipSync(raw)
      : raw;

  if (encoding) headers['Content-Encoding'] = encoding;
  headers['Vary'] = 'Accept-Encoding';
  headers['Content-Length'] = body.length;

  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

function proxyApi(req, res) {
  if (!API_TARGET) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: 'API proxy is not configured. Set API_PROXY_TARGET on the frontend service.',
    }));
  }

  let target;
  try {
    target = new URL(API_TARGET);
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'API_PROXY_TARGET is not a valid URL.' }));
  }

  const client = target.protocol === 'https:' ? https : http;
  const upstream = client.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: req.url,
      headers: { ...req.headers, host: target.host },
    },
    (upRes) => {
      res.writeHead(upRes.statusCode || 502, upRes.headers);
      upRes.pipe(res);
    }
  );

  upstream.on('error', (err) => {
    console.error('[proxy] /api request failed:', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ error: 'Backend unavailable.' }));
  });

  req.pipe(upstream);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (urlPath === '/api' || urlPath.startsWith('/api/')) {
    return proxyApi(req, res);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(DIST, safePath);

  if (!file.startsWith(DIST)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  if (urlPath.endsWith('/')) file = path.join(file, 'index.html');

  fs.stat(file, (err, stat) => {
    if (!err && stat.isFile()) {
      return sendCompressed(req, res, file);
    }

    // Missing asset with an extension: real 404, do not fall back to HTML.
    if (path.extname(urlPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }

    // SPA fallback.
    const indexFile = path.join(DIST, 'index.html');
    fs.access(indexFile, fs.constants.R_OK, (indexErr) => {
      if (indexErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Build output missing. Run `npm run build` first.');
      }
      sendCompressed(req, res, indexFile, 200);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[IncuxAI Frontend] Serving ${DIST} on http://${HOST}:${PORT}`);
  console.log(`[IncuxAI Frontend] API proxy: ${API_TARGET || 'disabled (set API_PROXY_TARGET)'}`);
});

server.on('error', (err) => {
  console.error('[IncuxAI Frontend] Server error:', err);
  process.exit(1);
});
