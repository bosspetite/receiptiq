import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { api } from "../services/api";

export default function DebugSession() {
    const [session, setSession] = useState(null);
    const [apiResp, setApiResp] = useState(null);
    const [error, setError] = useState(null);

    async function showSession() {
        setError(null);
        try {
            const { data } = await supabase.auth.getSession();
            setSession(data?.session ?? null);
        } catch (e) {
            setError(String(e?.message || e));
        }
    }

    async function callExpenses() {
        setError(null);
        try {
            const r = await api.get("/expenses");
            setApiResp({ status: r.status, body: r.data });
        } catch (e) {
            setApiResp(null);
            setError(String(e?.message || e));
        }
    }

    return (
        <div className="ri-page">
            <h1 className="ri-h1">Debug: Supabase session</h1>
            <p className="mb-4">
                Use these controls to inspect the client session and trigger a
                proxied API request.
            </p>
            <div className="mb-4 flex gap-2">
                <button onClick={showSession} className="ri-btn-primary">
                    Show session
                </button>
                <button onClick={callExpenses} className="ri-btn-secondary">
                    Call /api/expenses
                </button>
            </div>

            {error && (
                <div className="ri-callout-danger mb-4">Error: {error}</div>
            )}

            <div className="mb-4">
                <h2 className="text-base font-semibold">Session (raw)</h2>
                <pre className="mt-2 max-h-48 overflow-auto bg-slate-900/40 p-3 text-sm">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>

            <div>
                <h2 className="text-base font-semibold">API response</h2>
                <pre className="mt-2 max-h-48 overflow-auto bg-slate-900/40 p-3 text-sm">
                    {JSON.stringify(apiResp, null, 2)}
                </pre>
            </div>
        </div>
    );
}
