import axios from "axios";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 120000,
});

function describeNetworkFailure() {
    const usingProxy = !import.meta.env.VITE_API_URL;
    if (usingProxy) {
        return "Cannot reach the ReceiptIQ API. Start the backend from the project root with npm run dev, or run npm run start:server and confirm http://localhost:5000/api/health responds.";
    }
    return `Cannot reach the API at ${baseURL}. Confirm the backend is running and that http://localhost:5000/api/health responds. For local dev, remove VITE_API_URL so requests use the Vite proxy (/api).`;
}

api.interceptors.request.use(async (config) => {
    if (isSupabaseConfigured) {
        // Primary: ask the client for the current session
        try {
            const { data } = await supabase.auth.getSession();
            const token = data?.session?.access_token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else if (typeof window !== "undefined" && window.localStorage) {
                // Fallback: some storage implementations or older flows may keep the
                // session under a different key. Try to find a stored session that
                // contains an access_token as a last resort (non-invasive).
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    if (
                        key.toLowerCase().includes("supabase") ||
                        key.toLowerCase().includes("auth")
                    ) {
                        try {
                            const val = localStorage.getItem(key);
                            if (!val) continue;
                            const parsed = JSON.parse(val);
                            // Look for common shapes: { currentSession: { access_token } } or { access_token }
                            const maybeToken =
                                parsed?.currentSession?.access_token ||
                                parsed?.access_token ||
                                parsed?.session?.access_token;
                            if (maybeToken) {
                                config.headers.Authorization = `Bearer ${maybeToken}`;
                                break;
                            }
                        } catch (_e) {
                            // ignore parse errors
                        }
                    }
                }
            }
            if (!config.headers.Authorization) {
                // Helpful hint for debugging in dev
                console.warn(
                    "[ReceiptIQ] No Supabase access token found for API request; server may respond with 401.",
                );
            }
        } catch (e) {
            console.warn(
                "[ReceiptIQ] Error reading Supabase session for API request",
                e?.message || e,
            );
        }
    }
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
            return Promise.reject(new Error(describeNetworkFailure()));
        }
        if (err.code === "ECONNABORTED") {
            return Promise.reject(
                new Error(
                    "Request timed out. Try again with a smaller file or check your connection.",
                ),
            );
        }
        const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Request failed";
        return Promise.reject(
            new Error(typeof message === "string" ? message : "Request failed"),
        );
    },
);
