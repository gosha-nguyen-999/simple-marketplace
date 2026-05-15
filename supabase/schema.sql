-- ============================================================
-- VaultTrade V3 Schema — safe to re-run multiple times
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. Tables ────────────────────────────────────────────────

create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  email      text,
  full_name  text,
  is_seller  boolean not null default false,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.seller_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade not null unique,
  status     text not null default 'pending', -- pending | approved | rejected
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id           bigserial primary key,
  user_id      uuid references auth.users on delete cascade not null,
  game         text not null,
  category     text not null,
  name         text not null,
  price        numeric(10,2) not null,
  rarity       text not null,
  condition    text not null,
  description  text,
  emoji        text not null,
  seller_name  text not null,
  seller_email text not null,
  created_at   timestamptz not null default now()
);

-- ── 2. Trigger: auto-create profile on signup ────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 3. Helper: is_admin() — avoids infinite recursion in RLS ─
-- Uses security definer so it bypasses RLS when checking the
-- profiles table, preventing the policy from querying itself.

create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- ── 4. Row-Level Security ────────────────────────────────────

alter table public.profiles        enable row level security;
alter table public.seller_requests enable row level security;
alter table public.listings         enable row level security;

-- Drop all policies first so re-runs don't error on duplicates
drop policy if exists "profiles: own insert"    on public.profiles;
drop policy if exists "profiles: own read"      on public.profiles;
drop policy if exists "profiles: own update"    on public.profiles;
drop policy if exists "profiles: admin read"    on public.profiles;
drop policy if exists "profiles: admin update"  on public.profiles;

drop policy if exists "requests: own insert"    on public.seller_requests;
drop policy if exists "requests: own read"      on public.seller_requests;
drop policy if exists "requests: admin read"    on public.seller_requests;
drop policy if exists "requests: admin update"  on public.seller_requests;

drop policy if exists "listings: public read"   on public.listings;
drop policy if exists "listings: seller insert" on public.listings;
drop policy if exists "listings: owner delete"  on public.listings;

-- profiles
create policy "profiles: own insert"   on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: own read"     on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update"   on public.profiles for update using (auth.uid() = id);
create policy "profiles: admin read"   on public.profiles for select using (public.is_admin());
create policy "profiles: admin update" on public.profiles for update using (public.is_admin());

-- seller_requests
create policy "requests: own insert"   on public.seller_requests for insert with check (auth.uid() = user_id);
create policy "requests: own read"     on public.seller_requests for select using (auth.uid() = user_id);
create policy "requests: admin read"   on public.seller_requests for select using (public.is_admin());
create policy "requests: admin update" on public.seller_requests for update using (public.is_admin());

-- listings
create policy "listings: public read"   on public.listings for select using (true);
create policy "listings: seller insert" on public.listings for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_seller)
);
create policy "listings: owner delete"  on public.listings for delete using (auth.uid() = user_id);

-- ── 5. Make yourself admin ───────────────────────────────────
-- After signing in once with Google, run this separately:
--
-- update public.profiles set is_admin = true where email = 'your@email.com';
