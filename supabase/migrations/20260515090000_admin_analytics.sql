-- Admin analytics — exposes aggregated lead + referral data to the browser
-- behind a shared admin token. Service-role-only tables (leads,
-- referral_conversions) stay locked down at the RLS layer; this RPC is
-- SECURITY DEFINER and validates the token before returning anything.
--
-- Rotate the token any time:
--   update public.app_settings set value = 'new-secret-here' where key = 'admin_token';

create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
-- No policies → only service role can SELECT/INSERT/UPDATE.

-- Seed a default token only if no row exists. Users should rotate immediately.
insert into public.app_settings (key, value)
values (
  'admin_token',
  'nbc-admin-' || encode(gen_random_bytes(8), 'hex')
)
on conflict (key) do nothing;

-- One RPC returning everything the dashboard needs in a single round-trip.
-- The browser passes the admin token; we compare it inside SECURITY DEFINER
-- so the underlying tables stay closed to anon.
create or replace function public.get_admin_analytics(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected text;
  v_result jsonb;
begin
  select value into v_expected from public.app_settings where key = 'admin_token';
  if v_expected is null then
    raise exception 'Admin analytics not configured (missing app_settings.admin_token)';
  end if;
  if p_token is null or p_token <> v_expected then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'totals', jsonb_build_object(
      'total_leads',         (select count(*) from public.leads),
      'paid_leads',          (select count(*) from public.leads where paid_at is not null),
      'unpaid_leads',        (select count(*) from public.leads where paid_at is null),
      'leads_last_7d',       (select count(*) from public.leads where created_at >= now() - interval '7 days'),
      'estimated_value_cents', coalesce(
                                 (select sum(estimate)::bigint * 100
                                    from public.leads
                                   where paid_at is not null),
                                 0
                               ),
      'referrers',           (select count(*) from public.referrals),
      'referral_conversions',(select count(*) from public.referral_conversions),
      'referral_revenue_cents', coalesce(
                                 (select sum(amount_cents)::bigint
                                    from public.referral_conversions
                                   where status in ('confirmed','paid')),
                                 0
                               )
    ),
    'leads', (
      select coalesce(jsonb_agg(row), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'id',          id,
            'email',       email,
            'name',        name,
            'phone',       phone,
            'segment',     segment,
            'pain',        pain,
            'estimate',    estimate,
            'status',      status,
            'paid_at',     paid_at,
            'created_at',  created_at,
            'stripe_session_id', stripe_session_id
          ) as row
          from public.leads
          order by created_at desc
          limit 500
        ) s
    ),
    'referrals', (
      select coalesce(jsonb_agg(row), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'code',                code,
            'owner_email',         owner_email,
            'owner_name',          owner_name,
            'count',               count,
            'total_earned_cents',  total_earned_cents,
            'commission_cents',    commission_cents,
            'status',              status,
            'created_at',          created_at
          ) as row
          from public.referrals
          order by count desc, created_at desc
        ) s
    ),
    'conversions', (
      select coalesce(jsonb_agg(row), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'id',              id,
            'referral_code',   referral_code,
            'referee_email',   referee_email,
            'referee_name',    referee_name,
            'product',         product,
            'amount_cents',    amount_cents,
            'commission_cents',commission_cents,
            'status',          status,
            'created_at',      created_at
          ) as row
          from public.referral_conversions
          order by created_at desc
          limit 500
        ) s
    )
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_admin_analytics(text) from public;
grant execute on function public.get_admin_analytics(text) to anon, authenticated;

comment on function public.get_admin_analytics(text) is
  'Returns aggregated lead + referral analytics. Requires the admin token stored in app_settings(admin_token).';
