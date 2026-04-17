import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePasswordForLogin } from '../utils/validation';
import { formatAuthError } from '../utils/authErrors';

export function Login() {
  const { session, signIn, loading: authLoading, isSupabaseConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && session) {
    return <Navigate to={from} replace />;
  }

  function clearFieldError(name) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const eCheck = validateEmail(email);
    const pCheck = validatePasswordForLogin(password);
    const nextErrors = {};
    if (!eCheck.ok) nextErrors.email = eCheck.message;
    if (!pCheck.ok) nextErrors.password = pCheck.message;
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!isSupabaseConfigured) {
      setFormError(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to client/.env, then restart the dev server.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await signIn(eCheck.value, pCheck.value);
      if (error) {
        const friendly = formatAuthError(error);
        setFormError(friendly);
        toast.error(friendly);
        return;
      }
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      const friendly = formatAuthError(err);
      setFormError(friendly);
      toast.error(friendly);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy px-4">
        <p className="text-slate-400">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="ri-container flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-navy-light/60 text-sm font-semibold text-accent">
                RQ
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                Receipt<span className="text-accent">IQ</span>
              </span>
            </Link>
          </div>

          <div className="ri-surface ri-surface-pad shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
            <h1 className="text-xl font-semibold text-white">Log in</h1>
            <p className="mt-1 text-sm text-slate-400">Use your email and password to access your workspace.</p>

            {!isSupabaseConfigured && (
              <div className="mt-4 ri-callout-warn" role="alert">
                <p className="font-medium">Setup required</p>
                <p className="mt-1 text-sm text-amber-200/90">
                  Add <code className="font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
                  <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> to{' '}
                  <code className="font-mono text-xs">client/.env</code>, then restart the dev server.
                </p>
              </div>
            )}

            {formError && (
              <div className="mt-4 ri-callout-danger" role="alert">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="ri-label">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    clearFieldError('email');
                  }}
                  className="ri-input"
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                />
                {fieldErrors.email && (
                  <p id="login-email-error" className="mt-1 text-sm text-red-300">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="login-password" className="ri-label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(ev) => {
                    setPassword(ev.target.value);
                    clearFieldError('password');
                  }}
                  className="ri-input"
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                />
                {fieldErrors.password && (
                  <p id="login-password-error" className="mt-1 text-sm text-red-300">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              <button type="submit" disabled={submitting} className="ri-btn-primary w-full py-2.5">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              No account?{' '}
              <Link to="/signup" className="font-medium text-slate-200 hover:text-accent">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
