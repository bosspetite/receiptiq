import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
    if (!url || !anonKey) {
      const err = new Error('Server missing Supabase configuration');
      err.statusCode = 500;
      throw err;
    }
    const supabase = createClient(url, anonKey);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      const err = new Error('Invalid or expired session');
      err.statusCode = 401;
      throw err;
    }
    req.user = user;
    req.accessToken = token;
    next();
  } catch (e) {
    next(e);
  }
}

export function supabaseForRequest(req) {
  return createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    },
  });
}
