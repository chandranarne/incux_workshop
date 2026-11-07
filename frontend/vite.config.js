import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envDir = fs.existsSync(path.resolve(__dirname, '../.env')) ? '../' : './'

export default defineConfig({
  plugins: [react()],
  envDir,
  server: {
    port: 5173,
    host: true,
  }
})
