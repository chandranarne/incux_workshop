import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envDir = fs.existsSync(path.resolve(__dirname, '../.env')) ? '../' : './'

const DIST_ASSETS = path.resolve(__dirname, 'dist', 'assets')

// Backend origin for the production preview server. On Railway you can point
// this at the private URL, e.g. http://backend.railway.internal:5000
const apiTarget = (
  process.env.API_PROXY_TARGET ||
  process.env.BACKEND_URL ||
  'https://steadfast-beauty-production-458e.up.railway.app'
).replace(/\/+$/, '')

/**
 * `vite preview` is the production server, so it has to behave like one:
 * - hashed files in /assets never change, so cache them for a year
 * - a missing file with an extension must be a real 404, not index.html
 * Everything else (gzip, ETag/304, SPA fallback) Vite already does.
 */
function previewAssets() {
  return {
    name: 'incuxai-preview-assets',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = (req.url || '').split('?')[0]
        if (!urlPath.startsWith('/assets/')) return next()

        let file
        try {
          file = path.resolve(DIST_ASSETS, decodeURIComponent(urlPath.slice('/assets/'.length)))
        } catch {
          file = ''
        }

        if (!file || !file.startsWith(DIST_ASSETS) || !fs.existsSync(file)) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end('Not Found')
        }

        const writeHead = res.writeHead
        res.writeHead = function (...args) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          return writeHead.apply(this, args)
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), previewAssets()],
  envDir,
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    // Railway's edge forwards the public host (workshops.incuxai.com, *.up.railway.app),
    // which Vite's preview host check rejects by default.
    allowedHosts: true,
    // Railway injects PORT. strictPort makes a port mismatch fail loudly
    // instead of silently listening on 4173 while the edge returns 502.
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
