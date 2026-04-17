import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/** True when both env vars look usable (avoids silent failures against placeholder URLs). */
export const isSupabaseConfigured = Boolean(
  url && anonKey && /^https?:\/\//i.test(url) && anonKey.length >= 12
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[ReceiptIQ] Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to client/.env (see client/.env.example), then restart the dev server.'
  );
}

/**
 * Single browser client. Uses your Supabase project from env; avoids shipping a fake URL that causes "Failed to fetch".
 */
export const supabase = createClient(
  url || 'https://invalid.receiptiq.local',
  anonKey || 'invalid-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: true,
    },
  }
);
