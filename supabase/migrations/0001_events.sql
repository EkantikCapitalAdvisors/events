-- Ekantik Events — Supabase schema (§2 of the master build spec).
-- Phase 1 ships off the typed config seed (src/data/events.ts); this migration
-- stands up the same shape in Postgres for the Phase 2 swap. Function
-- signatures in src/lib/events.ts are unchanged when the source flips to here.

create extension if not exists "pgcrypto";

-- ── enums ───────────────────────────────────────────────────────────────────
do $$ begin
  create type event_category as enum ('ecfs', 'alpha', 'epig', 'foundational');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Decouples the legal lane from the display category — disclaimer footer
  -- renders off this, not off category.
  create type compliance_profile as enum ('futures', 'publisher', 'advisory');
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_type as enum ('webinar', 'meeting');
exception when duplicate_object then null; end $$;

do $$ begin
  create type event_status as enum ('upcoming', 'live', 'past');
exception when duplicate_object then null; end $$;

-- ── events (source of truth) ────────────────────────────────────────────────
create table if not exists events (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text unique not null,
  title                   text not null,
  subtitle                text,
  description             text,                     -- markdown
  what_youll_learn        text[] not null default '{}',
  category                event_category not null,
  compliance_profile      compliance_profile not null,
  speaker_name            text,
  speaker_title           text,
  speaker_bio             text,
  datetime_start          timestamptz not null,     -- store UTC, render localized
  duration_min            int not null default 60,
  session_type            session_type not null default 'webinar',
  zoom_session_id         text,
  zoom_registration_url   text,
  capacity                int,
  registration_count      int not null default 0,
  status                  event_status not null default 'upcoming',
  is_gated                boolean not null default false,
  requires_accreditation  boolean not null default false,
  replay_url              text,
  thumbnail_url           text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists events_category_idx on events (category);
create index if not exists events_status_idx on events (status);
create index if not exists events_datetime_idx on events (datetime_start);

-- ── registrations (Phase 2 native capture) ──────────────────────────────────
create table if not exists registrations (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references events (id) on delete cascade,
  name                text not null,
  email               text not null,
  phone               text,
  accredited          boolean not null default false,
  source_ref          text,                          -- from ?ref= (attribution)
  zoom_registrant_id  text,
  zoom_join_url       text,                          -- UNIQUE per registrant
  hubspot_contact_id  text,
  created_at          timestamptz not null default now(),
  -- Idempotency: one registration per person per event (§4 gotchas).
  unique (event_id, email)
);

create index if not exists registrations_event_idx on registrations (event_id);

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on events;
create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Public surfaces read only non-gated events; gated EPIG never leaks to anon.
-- Cross-contamination guardrail enforced at the database boundary (§6).
alter table events enable row level security;
alter table registrations enable row level security;

drop policy if exists events_public_read on events;
create policy events_public_read on events
  for select using (is_gated = false);

-- Gated reads + all writes go through the service role (server-side only).
-- registrations has no anon policy: inserts happen via the server route.
