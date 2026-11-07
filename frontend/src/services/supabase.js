import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
  '';

const isPlaceholder = (val) => !val || val.includes('your-supabase-') || val.includes('your-project-id');

export const isSupabaseReady = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !isPlaceholder(supabaseUrl) && 
  !isPlaceholder(supabaseAnonKey)
);

export const supabase = isSupabaseReady 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseReady) {
  console.log('[IncuxAI Frontend] Connected to Supabase:', supabaseUrl);
} else {
  console.info('[IncuxAI Frontend] Supabase URL configured (' + (supabaseUrl || 'pending') + '). Waiting for VITE_SUPABASE_ANON_KEY in .env.');
}

export default supabase;
