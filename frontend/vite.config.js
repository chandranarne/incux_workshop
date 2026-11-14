import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envDir = fs.existsSync(path.resolve(__dirname, '../.env')) ? '../' : './'

const DIST_ASSETS = path.resolve(__dirname, 'dist', 'assets')

// Backend origin for the /api proxy. Always comes from the environment.
// `localhost` is only a development fallback, so nothing deployed is hardcoded.
const apiTargetEnv = process.env.API_PROXY_TARGET || process.env.BACKEND_URL
const apiTarget = (
  apiTargetEnv ||
  `http://localhost:${process.env.BACKEND_PORT || 5000}`
).replace(/\/+$/, '')
const hasApiTarget = Boolean(apiTargetEnv)

if (process.env.PORT && !hasApiTarget) {
  console.warn(
    '[vite] No API_PROXY_TARGET or BACKEND_URL set. /api will answer 503 ' +
    'until you set one on the frontend service.'
  )
}

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
      // Without a configured backend there is no proxy middleware, so answer
      // /api explicitly instead of letting it fall through to index.html.
      if (!hasApiTarget) {
        server.middlewares.use('/api', (req, res) => {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({
            error: 'Backend proxy is not configured',
            detail: 'Set API_PROXY_TARGET (or BACKEND_URL) on this service.',
          }))
        })
      }

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
        target: apiTarget,
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
    // Only proxy when a target is configured; otherwise the plugin above
    // returns a clear 503 instead of proxying to a dead localhost port.
    ...(hasApiTarget
      ? {
          proxy: {
            '/api': {
              target: apiTarget,
              changeOrigin: true,
            },
          },
        }
      : {}),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
