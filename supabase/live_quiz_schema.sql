-- Live Quiz demo schema for Vercel + Supabase Free.
-- Run this once in Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.live_quiz_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  room_name text not null,
  host_name text not null,
  host_token text not null,
  status text not null default 'lobby'
    check (status in ('lobby', 'playing', 'ended')),
  config jsonb not null default '{}'::jsonb,
  question_set jsonb not null default '[]'::jsonb,
  buffs_enabled boolean not null default true,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_quiz_players (
  id uuid primary key default gen_random_uuid(),
  room_code text not null references public.live_quiz_rooms(room_code)
    on delete cascade,
  player_token text not null,
  name text not null,
  status text not null default 'lobby'
    check (status in ('lobby', 'playing', 'submitted', 'disconnected')),
  question_order jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  correct_count integer not null default 0,
  answered_count integer not null default 0,
  total_questions integer not null default 0,
  active_buff jsonb,
  buffs jsonb not null default '[]'::jsonb,
  joined_at timestamptz not null default now(),
  submitted_at timestamptz,
  last_seen timestamptz not null default now(),
  unique (room_code, player_token)
);

create index if not exists live_quiz_rooms_room_code_idx
  on public.live_quiz_rooms(room_code);

create index if not exists live_quiz_players_room_code_idx
  on public.live_quiz_players(room_code);

alter table public.live_quiz_rooms enable row level security;
alter table public.live_quiz_players enable row level security;

-- Demo policies: public read/write so classmates can join without auth.
-- For production, replace these with authenticated policies or Edge Functions.
drop policy if exists "live quiz rooms demo select" on public.live_quiz_rooms;
drop policy if exists "live quiz rooms demo insert" on public.live_quiz_rooms;
drop policy if exists "live quiz rooms demo update" on public.live_quiz_rooms;
drop policy if exists "live quiz players demo select" on public.live_quiz_players;
drop policy if exists "live quiz players demo insert" on public.live_quiz_players;
drop policy if exists "live quiz players demo update" on public.live_quiz_players;

create policy "live quiz rooms demo select"
  on public.live_quiz_rooms for select
  using (true);

create policy "live quiz rooms demo insert"
  on public.live_quiz_rooms for insert
  with check (true);

create policy "live quiz rooms demo update"
  on public.live_quiz_rooms for update
  using (true)
  with check (true);

create policy "live quiz players demo select"
  on public.live_quiz_players for select
  using (true);

create policy "live quiz players demo insert"
  on public.live_quiz_players for insert
  with check (true);

create policy "live quiz players demo update"
  on public.live_quiz_players for update
  using (true)
  with check (true);

alter table public.live_quiz_rooms replica identity full;
alter table public.live_quiz_players replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'live_quiz_rooms'
  ) then
    alter publication supabase_realtime add table public.live_quiz_rooms;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'live_quiz_players'
  ) then
    alter publication supabase_realtime add table public.live_quiz_players;
  end if;
end $$;
