const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Ensure root .env is loaded if process.env values are not present
if (!process.env.SUPABASE_URL) {
  const rootEnvPath = path.join(__dirname, '..', '.env');
  const backendEnvPath = path.join(__dirname, '.env');
  const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath;
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!process.env[key]) process.env[key] = val;
        }
      }
    });
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.SUPABASE_PUBLISHABLE_KEY;

const isPlaceholder = (val) => !val || val.includes('your-supabase-') || val.includes('your-project-id');

let supabase = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseKey && !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseKey)) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    isSupabaseConfigured = true;
    console.log('[IncuxAI Supabase] Initialized connection to:', supabaseUrl);
  } catch (err) {
    console.warn('[IncuxAI Supabase] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[IncuxAI Supabase] URL set to:', supabaseUrl || 'none', '| Waiting for ANON/SERVICE_ROLE key in .env (falling back to local JSON store).');
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  supabaseUrl
};
