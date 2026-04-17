/**
 * Turn Supabase Auth errors (and fetch failures) into short, actionable copy.
 */
export function formatAuthError(error) {
  if (!error) return 'Something went wrong. Try again.';

  const msg = String(error.message || error.error_description || error).trim();
  const lower = msg.toLowerCase();

  if (lower.includes('failed to fetch') || lower.includes('networkerror') || error.name === 'AuthRetryableFetchError') {
    return 'Cannot reach Supabase. Check VITE_SUPABASE_URL in client/.env, your network, and that the project URL is correct. Then restart npm run dev.';
  }

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Wrong email or password. Try again or reset your password in Supabase.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Confirm your email first. Check your inbox for the Supabase confirmation link.';
  }

  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Log in instead.';
  }

  if (lower.includes('password') && lower.includes('least')) {
    return msg;
  }

  if (lower.includes('invalid email')) {
    return 'That email does not look valid.';
  }

  if (lower.includes('signup_disabled') || lower.includes('signups not allowed')) {
    return 'Sign up is disabled for this project. Enable it in Supabase → Authentication → Providers.';
  }

  return msg || 'Something went wrong. Try again.';
}
