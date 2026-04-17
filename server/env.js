import dotenv from "dotenv";
import path from "node:path";
import { existsSync } from "node:fs";

const envCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "server", ".env"),
];

const envPath = envCandidates.find((candidate) => existsSync(candidate));

if (envPath) {
    // Load server/.env in local development without depending on import.meta.url,
    // which can be transformed away by serverless bundlers.
    dotenv.config({ path: envPath, override: true });
} else {
    dotenv.config({ override: true });
}

if (process.env.NODE_ENV !== "production") {
    const sUrl = (process.env.SUPABASE_URL || "").trim();
    const sKey = (process.env.SUPABASE_ANON_KEY || "").trim();
    const gemini = (process.env.GEMINI_API_KEY || "").trim();
    const hasSupabase = Boolean(sUrl && sKey);
    const hasGemini = Boolean(gemini);
    console.log(
        `[ReceiptIQ] Loaded env from ${envPath || "process environment only"}`,
    );
    console.log(
        `[ReceiptIQ] Config: supabase=${hasSupabase} gemini=${hasGemini} (lengths: SUPABASE_URL=${sUrl.length} SUPABASE_ANON_KEY=${sKey.length} GEMINI_API_KEY=${gemini.length})`,
    );
}
