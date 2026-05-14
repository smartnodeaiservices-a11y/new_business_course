-- Allow the browser to create/read referral codes directly, without the
-- `claim-referral` Edge Function (which kept 404-ing because it wasn't deployed
-- to the live Supabase project).
--
-- Safety model:
--   * Anyone can INSERT a row, but the policy pins money/status fields to
--     their safe defaults so a caller cannot seed a bogus balance.
--   * Reads are already public via the existing "Public can read referral by
--     code" policy (added in 20260513100000_referrals.sql).
--   * Updates remain service-role-only — payouts/conversions still flow
--     through Edge Functions (record-referral).

-- 1. Track who referred each new code-owner. Optional — null when the
--    referrer arrived organically.
alter table public.referrals
  add column if not exists referred_by_code text
    references public.referrals(code) on delete set null;

create index if not exists referrals_referred_by_idx
  on public.referrals (referred_by_code);

-- 2. Public insert policy. The WITH CHECK pins every column that could be
--    abused to its default — count/total_earned/status/etc. — so a malicious
--    client cannot inflate their own balance or unfreeze a paused code.
drop policy if exists "Public insert referrals" on public.referrals;
create policy "Public insert referrals"
  on public.referrals for insert
  with check (
    count = 0
    and total_earned_cents = 0
    and commission_cents = 2500
    and referee_discount_cents = 2500
    and status = 'active'
  );
