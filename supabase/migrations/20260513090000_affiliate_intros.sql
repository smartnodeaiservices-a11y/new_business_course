-- Affiliate intro requests — captures form submissions from module handouts
-- where the affiliate must be introduced via email (vs. given a direct link).
--
-- Public can INSERT (from the browser form), but reads stay closed.
-- Service role (the affiliate-intro Edge Function) handles email dispatch.

create table if not exists public.affiliate_intros (
  id uuid primary key default gen_random_uuid(),
  partner text not null,
  affiliate_email text not null,
  source text default 'module-handout',
  requester_name text not null,
  requester_email text not null,
  business_name text,
  context text,
  status text default 'pending',
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.affiliate_intros enable row level security;

create policy "Public insert affiliate intros"
  on public.affiliate_intros for insert with check (true);

create index if not exists affiliate_intros_partner_idx on public.affiliate_intros (partner);
create index if not exists affiliate_intros_status_idx on public.affiliate_intros (status, created_at desc);
