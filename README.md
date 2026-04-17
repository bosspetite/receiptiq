# ReceiptIQ

AI-powered receipt and expense tracker: **React + Vite + Tailwind** frontend, **Express** API, **Supabase** for auth and data, **OpenAI** vision for extraction, **Recharts** on the dashboard, **Axios** + **React Hot Toast** in the UI.

## Quick start (Windows / PowerShell)

1. **Open the correct folder** — In File Explorer, go to the place where you saved ReceiptIQ. You must see **`client`**, **`server`**, and **`package.json`** in the same folder.  
   If `cd C:\Users\LENOVO\receiptiq\server` says *path does not exist*, your project lives somewhere else (e.g. Desktop, Documents). Locate that folder first.

**If your prompt ends in `\receiptiq\client>`** or **`\receiptiq\server>`** (you are one folder inside the project): do **not** type placeholder paths. Either go up with **`cd ..`**, or stay where you are and run **`npm run install-all`** then **`npm run dev:all`** (those scripts exist in **both** `client` and `server`). See **`client/IF_YOU_ARE_HERE_README.txt`** or **`server/IF_YOU_ARE_HERE_README.txt`**.

2. **Install everything once** from the project **root** (the `receiptiq` folder that contains `client` and `server` — prompt should end in `\receiptiq>`, not `\receiptiq\client>`):

   ```powershell
   cd C:\Users\LENOVO\receiptiq
   ```

   Use your real path if it differs (the folder that contains **`package.json`** next to **`client`**).

   Then either:

   ```powershell
   .\install.ps1
   ```

   If PowerShell says scripts are disabled, run: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\install.ps1
   ```

   or:

   ```powershell
   npm install
   ```

   If you skip this step, you will see errors like **`Cannot find package 'dotenv'`** — that means dependencies were never installed.

3. **Start the app** — Still in the **root** folder (`...\receiptiq>`):

   ```powershell
   npm run dev
   ```

   Same as **`npm run dev:all`**. This starts **both** the API and the Vite dev server in **one** terminal. Open **http://localhost:5173** in your browser.

   At the root, **`npm run install-all`** is the same as **`npm install`** (installs client + server workspaces).

   - API: http://localhost:5000/api/health  
   - Web app: http://localhost:5173  

**Do not run `npm run dev` from `C:\Users\LENOVO`** (your user folder) — there is no `package.json` there. Always `cd` into the `receiptiq` project folder first.

## Repository layout

```
receiptiq/
├── client/          # Vite React app
├── server/          # Express API
├── .env.example     # Variable reference
└── README.md
```

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

## Supabase schema

Run [`supabase/schema.sql`](/C:/Users/LENOVO/receiptiq/supabase/schema.sql) in the Supabase SQL editor. It is safe to re-run and will:

- create the `expenses` table if it does not exist
- add any missing columns from older local setups
- enable and force Row Level Security
- create per-user policies so each signed-in user only accesses their own expenses

Key idea: the app sends the current user's Supabase JWT to the API, and the API forwards that JWT to Supabase when it reads or writes expenses. Because the RLS policies compare `auth.uid()` to `expenses.user_id`, each user only sees their own rows.

If you want the core SQL inline, this is the important shape:

```sql
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  vendor text not null,
  date date,
  amount double precision not null,
  category text not null default 'General',
  items jsonb not null default '[]'::jsonb,
  receipt_url text,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;
alter table public.expenses force row level security;

create policy "Users read own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
```

Optional: use Supabase Storage for receipt files and store the public/signed URL in `receipt_url`.

## Environment variables

1. Copy `server/.env.example` to `server/.env` and fill in `SUPABASE_*`, `GEMINI_API_KEY`, and optionally `PORT` / `CLIENT_ORIGIN`.
2. Copy `client/.env.example` to `client/.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. For the client to call the API without the Vite proxy, set `VITE_API_URL` (e.g. `http://localhost:5000/api`). If unset, the dev server proxies `/api` to port 5000.

## Supabase Auth redirect URL (important for sign-up)

In Supabase, add your local callback URL to the allowlist:

- **Authentication → URL Configuration → Redirect URLs**
- Add: `http://localhost:5173/auth/callback`

ReceiptIQ uses that route to finish auth redirects (email confirmation links / OAuth).

## Install and run

From the **ReceiptIQ project root** (the folder that contains `client/`, `server/`, and `package.json`):

```powershell
cd path\to\receiptiq
npm install
```

**Easiest — one terminal (API + client together):**

```powershell
npm run dev
```

**Or two terminals:**

```powershell
npm run dev:server
```

```powershell
npm run dev:client
```

**Or install each package alone** (if you are not using the root workspace):

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Schema SQL is also in `supabase/schema.sql` (same as below).

### Troubleshooting

| Problem | Fix |
|--------|-----|
| `Cannot find path ...\receiptiq\server` | Your project is not at that path. Search for `receiptiq` on your PC or open the folder that contains `client` and `server`. |
| `Could not read package.json` from `C:\Users\LENOVO` | You ran npm in your user folder. `cd` into the `receiptiq` project root first. |
| `Cannot find package 'dotenv'` (or express, etc.) | Run `npm install` from the **project root**, or `npm install` inside `server`. |
| Blank terminal after `npm run dev` | From the root, use `npm run dev` (not plain `npm run dev` from `C:\Users\LENOVO`). Root `package.json` defines this script. |
| Port 5173 in use | Stop the other Vite app or change `port` in `client/vite.config.js`. |
| `VITE_SUPABASE_URL ... is missing` | Create **`client/.env`** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase → Project Settings → API. Copy **`client/.env.example`** to **`client/.env`**. **Restart** `npm run dev` after saving. |
| `Invalid hook call` / `useRef` of null | From project root run **`npm install`** (uses `overrides` for a single React). Restart dev. See **`client/SUPABASE_SETUP.txt`**. |

- App: `http://localhost:5173`
- Health check: `http://localhost:5000/api/health`

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Liveness |
| GET | `/api/auth/me` | Bearer JWT | Current user |
| GET | `/api/expenses` | Bearer JWT | List expenses (RLS) |
| GET | `/api/expenses/summary` | Bearer JWT | Totals + category breakdown |
| POST | `/api/expenses` | Bearer JWT | Create expense |
| POST | `/api/upload/extract` | Bearer JWT | Multipart `receipt` image → AI JSON |

## Flow: receipt → AI → save

1. User uploads an image on **Upload**; the client posts `FormData` with field `receipt` to `/api/upload/extract`.
2. The server calls OpenAI vision and returns structured fields.
3. The user edits the form and submits; the client `POST`s JSON to `/api/expenses`, which inserts using the user’s JWT (RLS).

PDF uploads are not processed by the vision endpoint; use a photo or exported image of the receipt.

## Production notes

- Build the client with `npm run build` in `client/` and serve static files or deploy to a host of your choice.
- Run the API with `npm start` in `server/` behind HTTPS.
- Set `CLIENT_ORIGIN` to your deployed web origin (comma-separated for multiple).
- Never expose the service role key in the browser; this scaffold uses the anon key plus user JWT only.
