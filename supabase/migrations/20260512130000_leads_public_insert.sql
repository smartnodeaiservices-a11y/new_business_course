-- Allow public (anon) inserts to leads from the browser. Reads remain closed —
-- only the service role (Edge Functions, admin tooling) can SELECT leads.
--
-- This matches the pattern already used by public.contact_messages.

create policy "Public insert leads"
  on public.leads for insert
  with check (true);
