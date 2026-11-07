const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[IncuxAI Build] Building frontend for Vercel...');
const frontendDir = path.join(__dirname, '..', 'frontend');
const rootDir = path.join(__dirname, '..');

// 1. Install frontend dependencies
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

// 2. Build Vite bundle
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// 3. Ensure dist exists at both frontend/dist and root dist
const frontendDist = path.join(frontendDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(frontendDist)) {
  fs.cpSync(frontendDist, rootDist, { recursive: true });
  console.log('[IncuxAI Build] Successfully populated dist at both frontend/dist and root /dist!');
}
