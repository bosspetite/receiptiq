I removed committed environment files (`server/.env` and `client/.env`) from the repository because they contained live API keys.

Next steps you should take immediately:

1. Rotate keys
    - Rotate the OpenAI API key and Supabase anon key in the provider dashboards.
    - Remove any tokens or credentials that may have been exposed.

2. Restore local env files
    - Copy `server/.env.example` to `server/.env` and fill with the new values.
    - Copy `client/.env.example` to `client/.env` and fill with the new values.

3. Commit safety
    - Ensure `.gitignore` contains `.env` (it already does).
    - Do NOT commit the `.env` files. Keep them local-only.

4. Optional (recommended)
    - Use secret managers (GitHub Secrets, Azure Key Vault, AWS Secrets Manager) for CI/CD and deployments.

If you want, I can:

- Create a git commit that removes the files from history (using git filter-branch or BFG) — this requires elevated git operations and may be disruptive; or
- Generate a step-by-step script for rotating keys.

Tell me which of the above you'd like me to do next.
