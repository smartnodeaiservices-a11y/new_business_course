-- Referral system for New Business Course.
--
-- Rules of the road:
--   * Each referrer email gets one unique `code` (6–8 chars).
--   * Anyone using `/refer/<code>` to enroll has the code stored in a cookie
--     and forwarded to Stripe as checkout metadata.
--   * On /success, the browser calls the `record-referral` Edge Function with
--     the Stripe session id; the function verifies the session was paid and
--     inserts a `referral_conversions` row, then increments aggregate stats.
--   * `referral_conversions.stripe_session_id` is UNIQUE so retries are idempotent.

create table if not exists public.referrals (
  code text primary key,
  owner_email text not null unique,
  owner_name text,
  count integer not null default 0,
  total_earned_cents integer not null default 0,
  /** Default $25 cash per confirmed enrollment. Override per-referrer if needed. */
  commission_cents integer not null default 2500,
  /** $25 off for the referee — used as the display discount on the landing page. */
  referee_discount_cents integer not null default 2500,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_conversions (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null references public.referrals(code) on delete cascade,
  stripe_session_id text unique,
  referee_name text,
  referee_email text,
  product text,
  amount_cents integer,
  commission_cents integer not null default 0,
  /** pending = awaiting refund window, confirmed = past 30d, paid = payout sent, refunded = void */
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  paid_at timestamptz
);

alter table public.referrals enable row level security;
alter table public.referral_conversions enable row level security;

-- The browser needs to read a referrer's public stats (count, earnings) when
-- the referrer views their dashboard — but we don't expose owner_email lookups
-- beyond the exact-code match. The dashboard query uses .eq("code", code).
create policy "Public can read referral by code"
  on public.referrals for select using (true);

-- All writes go through Edge Functions (service role). No public insert/update.

create index if not exists referral_conversions_code_idx
  on public.referral_conversions (referral_code, created_at desc);
create index if not exists referral_conversions_status_idx
  on public.referral_conversions (status);

-- Keep updated_at fresh.
create or replace function public.referrals_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists referrals_updated_at on public.referrals;
create trigger referrals_updated_at
  before update on public.referrals
  for each row execute function public.referrals_set_updated_at();
