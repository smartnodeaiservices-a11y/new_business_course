
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  segment text,
  pain text,
  estimate integer,
  status text not null default 'new',
  stripe_session_id text,
  ghl_synced_at timestamptz,
  smartlead_synced_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index leads_email_idx on public.leads (lower(email));
create index leads_stripe_session_idx on public.leads (stripe_session_id);
alter table public.leads enable row level security;
-- No policies => no anon/auth access. Service role bypasses RLS.
