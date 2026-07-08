-- RoutineStars Lite — Supabase schema
-- Run once in SQL Editor → New query → Run

create table if not exists households (
  id         uuid        primary key default gen_random_uuid(),
  data       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists households_set_updated_at on households;
create trigger households_set_updated_at
  before update on households for each row execute function set_updated_at();

alter table households enable row level security;

drop policy if exists "household_select" on households;
create policy "household_select" on households for select using (true);

drop policy if exists "household_insert" on households;
create policy "household_insert" on households for insert with check (true);

drop policy if exists "household_update" on households;
create policy "household_update" on households for update using (true);
