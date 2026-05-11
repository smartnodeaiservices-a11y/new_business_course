-- Stripe pricing + contact form storage.

-- Stripe Price ID per course. Course.price_cents stays as the display price;
-- stripe_price_id is what gets passed to redirectToCheckout.
alter table public.courses add column if not exists stripe_price_id text;

-- Contact messages from the /contact page.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text default 'contact-page',
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Public can INSERT contact messages (the form), but reads stay closed.
create policy "Public insert contact messages"
  on public.contact_messages for insert with check (true);
