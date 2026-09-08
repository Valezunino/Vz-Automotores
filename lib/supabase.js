import { createClient } from '@supabase/supabase-js';

function env(name, fallback) {
  const value = process.env[name] || (fallback ? process.env[fallback] : undefined);
  if (!value) throw new Error(`MISSING_${name}`);
  return value;
}

export function getAdminClient() {
  return createClient(env('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function getPublicConfig() {
  return {
    url: env('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: env('SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  };
}

export function isSupabaseConfigured() {
  return Boolean((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
