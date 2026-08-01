-- PitchStudy — "Join the Club" accounts schema.
-- Run this once in your Supabase project's SQL Editor (or via the Supabase
-- CLI: `supabase db push`). Safe to re-run — every statement is idempotent.
--
-- One row per user, mirroring the localStorage schema exactly (see
-- src/lib/playerCard.ts and src/lib/progress.ts). Accounts exist for one
-- reason only — cross-device sync — so this table holds nothing that isn't
-- already stored on the device.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
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
