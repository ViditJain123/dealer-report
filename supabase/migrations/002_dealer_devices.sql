-- 002_dealer_devices.sql
-- Phase 2: dealer login with device binding.
--
-- Apply after 001_initial_schema.sql, via the Supabase dashboard → SQL Editor.
-- Keep src/lib/supabase/types.ts in sync with this file.

-- Dealers log in with their phone number as the lookup key, so it must be
-- globally unique. Guarded so the migration is safe to re-run.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'dealers_phone_number_key'
  ) then
    alter table public.dealers
      add constraint dealers_phone_number_key unique (phone_number);
  end if;
end $$;

-- ─── dealer_sessions ─────────────────────────────────────────────────────────
-- One row per active dealer app session. The React Native app holds the raw
-- opaque token (in expo-secure-store) and sends it as a Bearer token; the DB
-- stores only its SHA-256 hash. No cookie — this is a mobile client.
create table if not exists public.dealer_sessions (
  id          uuid        primary key default gen_random_uuid(),
  dealer_id   uuid        not null references public.dealers (id) on delete cascade,
  token_hash  text        not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now(),
  constraint dealer_sessions_token_hash_key unique (token_hash)
);

create index if not exists dealer_sessions_dealer_id_idx  on public.dealer_sessions (dealer_id);
create index if not exists dealer_sessions_expires_at_idx on public.dealer_sessions (expires_at);

-- ─── dealer_devices ──────────────────────────────────────────────────────────
-- A dealer's account binds to one device. The `active` row is the bound device;
-- a `pending` row is a device-change request awaiting distributor approval.
create table if not exists public.dealer_devices (
  id            uuid        primary key default gen_random_uuid(),
  dealer_id     uuid        not null references public.dealers (id) on delete cascade,
  device_id     text        not null,
  device_label  text        not null default '',
  status        text        not null check (status in ('active', 'pending')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  approved_at   timestamptz
);

create index if not exists dealer_devices_dealer_id_idx on public.dealer_devices (dealer_id);

-- At most one bound (active) device, and one pending request, per dealer.
create unique index if not exists dealer_devices_one_active_per_dealer
  on public.dealer_devices (dealer_id) where status = 'active';
create unique index if not exists dealer_devices_one_pending_per_dealer
  on public.dealer_devices (dealer_id) where status = 'pending';

-- updated_at trigger (reuses the function defined in 001_initial_schema.sql).
drop trigger if exists dealer_devices_set_updated_at on public.dealer_devices;
create trigger dealer_devices_set_updated_at
  before update on public.dealer_devices
  for each row execute function public.set_updated_at();
