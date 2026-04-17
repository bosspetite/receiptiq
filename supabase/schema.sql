-- ReceiptIQ: expenses table + RLS
-- Run this entire file in the Supabase SQL Editor.
-- Safe to re-run: it creates missing pieces and refreshes the policies.

create extension if not exists pgcrypto;

create table if not exists public.expenses (
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

alter table public.expenses
  add column if not exists user_id uuid references auth.users (id) on delete cascade,
  add column if not exists vendor text,
  add column if not exists date date,
  add column if not exists amount double precision,
  add column if not exists category text default 'General',
  add column if not exists items jsonb default '[]'::jsonb,
  add column if not exists receipt_url text,
  add column if not exists currency text default 'USD',
  add column if not exists created_at timestamptz default now();

alter table public.expenses
  alter column user_id set not null,
  alter column vendor set not null,
  alter column amount set not null,
  alter column category set default 'General',
  alter column items set default '[]'::jsonb,
  alter column currency set default 'USD',
  alter column created_at set default now();

create index if not exists expenses_user_id_idx
  on public.expenses (user_id);

create index if not exists expenses_user_id_created_at_idx
  on public.expenses (user_id, created_at desc);

alter table public.expenses enable row level security;
alter table public.expenses force row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.expenses to authenticated;

drop policy if exists "Users read own expenses" on public.expenses;
create policy "Users read own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own expenses" on public.expenses;
create policy "Users insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own expenses" on public.expenses;
create policy "Users update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own expenses" on public.expenses;
create policy "Users delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

comment on table public.expenses is
  'ReceiptIQ expense records. Every row belongs to exactly one authenticated user.';
