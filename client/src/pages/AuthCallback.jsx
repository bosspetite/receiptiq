import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { formatAuthError } from '../utils/authErrors';

export function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { session, loading } = useAuth();
  const [status, setStatus] = useState('Working…');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // If Supabase redirected back with an error
      const errorDescription = params.get('error_description') || params.get('error');
      if (errorDescription) {
        toast.error(formatAuthError({ message: errorDescription }));
        navigate('/login', { replace: true });
        return;
      }

      // For OAuth / PKCE flows, Supabase sends `code` that must be exchanged for a session.
      const code = params.get('code');
      if (code) {
        setStatus('Finishing sign-in…');
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          toast.error(formatAuthError(error));
          navigate('/login', { replace: true });
          return;
        }
      }

      // Email confirmations may set session automatically via detectSessionInUrl.
      setStatus('Redirecting…');
      navigate('/dashboard', { replace: true });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, params]);

  // If we already have a session, just continue to the app.
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-navy-light p-8 text-center shadow-xl">
        <p className="text-lg font-semibold text-white">ReceiptIQ</p>
        <p className="mt-3 text-sm text-slate-400">{status}</p>
        <div className="mt-6 flex justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </div>
    </div>
  );
}

