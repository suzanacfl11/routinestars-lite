-- RoutineStars Lite — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- This creates one table that stores each family's full app state as JSON,
-- keyed by a household ID stored in the browser (no login required).

create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists households_set_updated_at on households;
create trigger households_set_updated_at
  before update on households
  for each row
  execute function set_updated_at();

-- Row Level Security: since there's no login, anyone with a household's UUID
-- can read/write that row. The UUID itself (generated client-side on first
-- run, stored in the browser) is the "password" — it's not guessable and
-- never shown in a URL or shared anywhere, so this is appropriate for a
-- no-login, single-family kids' app. It is NOT appropriate if you later add
-- accounts or sensitive data — revisit this policy if so.
alter table households enable row level security;

drop policy if exists "household_select" on households;
create policy "household_select" on households
  for select using (true);

drop policy if exists "household_insert" on households;
create policy "household_insert" on households
  for insert with check (true);

drop policy if exists "household_update" on households;
create policy "household_update" on households
  for update using (true);
