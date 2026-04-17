import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

function notConfiguredError() {
    return {
        message:
            "Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to client/.env, then restart npm run dev.",
    };
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setSession(null);
            setLoading(false);
            return undefined;
        }

        let cancelled = false;

        supabase.auth.getSession().then(({ data: { session: s }, error }) => {
            if (cancelled) return;
            if (error) {
                console.warn("[ReceiptIQ] getSession:", error.message);
                setSession(null);
            } else {
                setSession(s);
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(
        () => ({
            session,
            loading,
            isSupabaseConfigured,
            user: session?.user ?? null,
            signIn: async (email, password) => {
                if (!isSupabaseConfigured)
                    return { data: null, error: notConfiguredError() };
                return supabase.auth.signInWithPassword({ email, password });
            },
            signUp: async (email, password) => {
                if (!isSupabaseConfigured)
                    return { data: null, error: notConfiguredError() };
                const redirectTo =
                    typeof window !== "undefined"
                        ? `${window.location.origin}/auth/callback`
                        : undefined;
                return supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectTo,
                    },
                });
            },
            signOut: async () => {
                if (!isSupabaseConfigured) return { error: null };
                return supabase.auth.signOut();
            },
            getAccessToken: () => session?.access_token ?? null,
        }),
        [session, loading],
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-navy">
                <div className="text-slate-400">Checking session…</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// Render a minimal full-screen loader while auth state is initializing
export function AuthProviderWithLoader({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return ctx;
}
