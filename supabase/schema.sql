-- PitchStudy — "Join the Club" accounts schema.
--
-- This file is a full-current-state REFERENCE snapshot, useful for setting
-- up a fresh project by hand (SQL Editor -> New query -> paste -> Run;
-- safe to re-run, every statement is idempotent). It is NOT what actually
-- gets applied going forward — supabase/migrations/*.sql is the source of
-- truth the CLI tracks (`supabase db push`), starting from a baseline
-- migration that mirrors what this file looked like at that point. Future
-- schema changes land as new migration files, not edits to this one.
--
-- One row per user, mirroring the localStorage schema exactly (see
-- src/lib/playerCard.ts and src/lib/progress.ts). Accounts exist for one
-- reason only — cross-device sync — so this table holds nothing that isn't
-- already stored on the device.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  -- Required at registration, unique sitewide — used for display (nav chip)
  -- and as an alternate login identifier alongside email (see
  -- public.email_for_username below for how login resolves it safely).
  username text unique,
  squad_number smallint check (squad_number between 1 and 99),
  -- Mirrors PlayerCard (playerCard.ts): nickname, position, playstyle,
  -- level, equipment, version, createdAt, updatedAt.
  player_card jsonb,
  -- Mirrors ProgressState (progress.ts): completedLessons,
  -- quizBestScores, xp, earnedBadges, challengeBestStreak, scenarioBests,
  -- completedDrillInstances, trainingDates.
  progress jsonb,
  -- Mirrors SavedPlay[] (scenario-mode/persistence.ts) — the Scenario Mode
  -- playbook (saved scenario attempts only).
  playbook jsonb,
  -- Mirrors PlaybookEntry[] (tactics-lab/playbookSchema.ts) — the general
  -- Tactics Lab Playbook (saved formations and Play Designer plays). A
  -- separate column from `playbook` above since the two hold structurally
  -- different entries (see playbookSchema.ts's own comment on why they
  -- aren't unified into one collection).
  tactics_playbook jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Adds the column to a profiles table that already existed before this
-- feature shipped — `create table if not exists` above is a no-op against
-- an existing table, so this is what actually applies it to a live project.
alter table public.profiles add column if not exists tactics_playbook jsonb;
alter table public.profiles add column if not exists username text;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_username_key'
  ) then
    alter table public.profiles add constraint profiles_username_key unique (username);
  end if;
end $$;

comment on table public.profiles is
  'One row per registered player. Populated and read entirely by the owning user via row-level security — there is no admin/service-role write path in the app.';

-- Keeps `updated_at` as server truth (not client-settable), since the
-- merge logic's "most-recent-edit wins" for the Player Card depends on it
-- being trustworthy rather than something a buggy or malicious client could
-- set to a future date to always "win."
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- One policy per verb, all scoped to "your own row only." There is
-- deliberately no policy granting broader access — nothing in this app
-- reads or writes another user's profile.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Username-based login needs to resolve a username to its account's email
-- BEFORE the caller is authenticated — impossible under the RLS policies
-- above by design (an anonymous caller can't read anyone's row, let alone
-- by username). This function is the one narrow, deliberate exception:
-- `security definer` runs it with the owning role's privileges (bypassing
-- RLS internally), but it exposes exactly one thing — a username's
-- matching email, or nothing — never the row itself. The login route calls
-- this via `supabase.rpc(...)`, then immediately calls signInWithPassword
-- with the resolved email; the username itself never needs to touch
-- anything other than this one lookup.
create or replace function public.email_for_username(lookup_username text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select email from public.profiles where username = lookup_username limit 1;
$$;

revoke all on function public.email_for_username(text) from public;
grant execute on function public.email_for_username(text) to anon, authenticated;

-- The admin dashboard (§ "amount of users and other stuff") needs to read
-- ACROSS every profile row — the opposite of every RLS policy above, all of
-- which scope to "your own row only." Rather than adding a broad
-- admin-can-read-everything RLS policy (a much bigger attack surface if
-- ever misconfigured), this is a single security-definer function, hard
-- gated to one specific email inside the function body itself, that
-- returns aggregate counts only — never an individual row, email, or
-- username. Update the email below if the admin account ever changes.
create or replace function public.admin_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if auth.email() is distinct from 'dgreatjosh123@gmail.com' then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'totalUsers', (select count(*) from public.profiles),
    'signupsLast7Days', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'signupsLast30Days', (select count(*) from public.profiles where created_at > now() - interval '30 days'),
    'usersWithPlayerCard', (select count(*) from public.profiles where player_card is not null),
    'usersWithUsername', (select count(*) from public.profiles where username is not null),
    'totalXp', (select coalesce(sum((progress->>'xp')::int), 0) from public.profiles),
    'totalLessonsCompleted', (select coalesce(sum(jsonb_array_length(progress->'completedLessons')), 0) from public.profiles where progress is not null),
    'totalBadgesEarned', (select coalesce(sum(jsonb_array_length(progress->'earnedBadges')), 0) from public.profiles where progress is not null),
    'totalScenarioSaves', (select coalesce(sum(jsonb_array_length(playbook)), 0) from public.profiles where playbook is not null),
    'totalPlaybookEntries', (select coalesce(sum(jsonb_array_length(tactics_playbook)), 0) from public.profiles where tactics_playbook is not null),
    -- Scoped to auth accounts that HAVE a profile row, so these chips
    -- describe the same population as totalUsers and the registered-users
    -- table. Accounts that authenticated but never finished the in-app
    -- flow (profiles are created client-side after login) are surfaced
    -- separately as authAccountsWithoutProfile instead of silently
    -- inflating the provider counts.
    'providerBreakdown', (
      select coalesce(json_object_agg(provider, provider_count), '{}'::json)
      from (
        select coalesce(u.raw_app_meta_data->>'provider', 'unknown') as provider, count(*) as provider_count
        from auth.users u
        where exists (select 1 from public.profiles pr where pr.id = u.id)
        group by 1
      ) as p
    ),
    'authAccountsWithoutProfile', (
      select count(*)
      from auth.users u
      where not exists (select 1 from public.profiles pr where pr.id = u.id)
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_stats() from public;
grant execute on function public.admin_stats() to authenticated;

-- Same gate and reasoning as admin_stats() above, but this one deliberately
-- does expose individual identities — username, email, signup date — since
-- that's exactly what was asked for. Still nothing beyond those three
-- fields: no progress, no Player Card, no playbook contents.
create or replace function public.admin_list_users()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if auth.email() is distinct from 'dgreatjosh123@gmail.com' then
    raise exception 'not authorized';
  end if;

  select coalesce(json_agg(row_to_json(u) order by u.created_at desc), '[]'::json)
  into result
  from (
    select username, email, created_at
    from public.profiles
  ) as u;

  return result;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

-- Setup checklist (dashboard, not SQL):
-- 1. Authentication -> Providers -> Email: enable, confirm "magic link" is on.
-- 2. Authentication -> Providers -> Google: enable, paste your Google Cloud
--    OAuth client ID + secret (create one at console.cloud.google.com ->
--    APIs & Services -> Credentials -> OAuth client ID -> Web application).
--    Google's "Authorized redirect URIs" must contain Supabase's OWN
--    callback — https://<your-project-ref>.supabase.co/auth/v1/callback —
--    not this app's /auth/callback. Supabase is the OAuth client from
--    Google's point of view; it forwards the user to this app's
--    /auth/callback itself afterwards, governed by step 3 below.
-- 3. Authentication -> URL Configuration: set Site URL to your deployed
--    origin, and add http://localhost:3000 (and your deployed origin's
--    /auth/callback, once deployed) under Redirect URLs — this is the
--    allow-list `signInWithOAuth`'s redirectTo and `signInWithOtp`'s
--    emailRedirectTo are checked against.
