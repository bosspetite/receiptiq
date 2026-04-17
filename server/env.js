import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

// Load server/.env even when started from repo root.
// `override: true` ensures we don't get stuck with empty vars from the parent process.
dotenv.config({ path: envPath, override: true });

if (process.env.NODE_ENV !== 'production') {
  const sUrl = (process.env.SUPABASE_URL || '').trim();
  const sKey = (process.env.SUPABASE_ANON_KEY || '').trim();
  const gemini = (process.env.GEMINI_API_KEY || '').trim();
  const hasSupabase = Boolean(sUrl && sKey);
  const hasGemini = Boolean(gemini);
  console.log(`[ReceiptIQ] Loaded env from ${envPath}`);
  console.log(
    `[ReceiptIQ] Config: supabase=${hasSupabase} gemini=${hasGemini} (lengths: SUPABASE_URL=${sUrl.length} SUPABASE_ANON_KEY=${sKey.length} GEMINI_API_KEY=${gemini.length})`
  );
}
