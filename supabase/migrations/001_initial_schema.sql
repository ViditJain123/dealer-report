-- 001_initial_schema.sql
-- Phase 1 authentication schema: distributors, dealers, sessions.
--
-- Apply this once via the Supabase dashboard → SQL Editor (paste + Run), or with
-- `supabase db push` if the CLI is linked. After applying, keep
-- src/lib/supabase/types.ts in sync with this file.

create extension if not exists citext;

-- ─── distributors ────────────────────────────────────────────────────────────
-- A distributor signs up on the Next.js web portal with email + password.
create table if not exists public.distributors (
  id            uuid primary key default gen_random_uuid(),
  email         citext      not null,
  password_hash text        not null,
  full_name     text        not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- citext makes this UNIQUE constraint case-insensitive.
  constraint distributors_email_key unique (email)
);

-- ─── dealers ─────────────────────────────────────────────────────────────────
-- Onboarded by a distributor. Dealers log in from the React Native app (Phase 2)
-- with dealer_code + password. dealer_code is unique *within* a distributor.
-- phone_number is stored E.164-normalized (e.g. +919876543210) so Phase 2 SIM
-- verification can match the SMS sender number against it.
create table if not exists public.dealers (
  id             uuid        primary key default gen_random_uuid(),
  distributor_id uuid        not null references public.distributors (id) on delete cascade,
  dealer_name    text        not null,
  dealer_code    text        not null,
  password_hash  text        not null,
  phone_number   text        not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint dealers_unique_code_per_distributor unique (distributor_id, dealer_code)
);

create index if not exists dealers_distributor_id_idx on public.dealers (distributor_id);
create index if not exists dealers_phone_number_idx   on public.dealers (phone_number);

-- ─── sessions ────────────────────────────────────────────────────────────────
-- One row per active distributor web session. The raw opaque token lives only in
-- the client's HttpOnly cookie; the DB stores only its SHA-256 hash.
create table if not exists public.sessions (
  id             uuid        primary key default gen_random_uuid(),
  distributor_id uuid        not null references public.distributors (id) on delete cascade,
  token_hash     text        not null,
  expires_at     timestamptz not null,
  created_at     timestamptz not null default now(),
  -- UNIQUE also provides the lookup index used on every authenticated request.
  constraint sessions_token_hash_key unique (token_hash)
);

create index if not exists sessions_distributor_id_idx on public.sessions (distributor_id);
create index if not exists sessions_expires_at_idx     on public.sessions (expires_at);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists distributors_set_updated_at on public.distributors;
create trigger distributors_set_updated_at
  before update on public.distributors
  for each row execute function public.set_updated_at();

drop trigger if exists dealers_set_updated_at on public.dealers;
create trigger dealers_set_updated_at
  before update on public.dealers
  for each row execute function public.set_updated_at();
