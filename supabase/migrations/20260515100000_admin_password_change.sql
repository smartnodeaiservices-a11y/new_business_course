-- Make the analytics gate use a real password ("New2026" by default) instead
-- of the random token, and let the admin rotate it from inside the dashboard.
--
-- Apply order: must run AFTER 20260515090000_admin_analytics.sql.

-- 1. Force the default password to "New2026" on fresh installs. If a row
--    already exists from the previous migration's random seed, this overwrites
--    it so the user has a known starting password.
insert into public.app_settings (key, value)
values ('admin_token', 'New2026')
on conflict (key) do update
  set value = excluded.value,
      updated_at = now();

-- 2. Password-change RPC. Requires the current password; returns true on
--    success. SECURITY DEFINER so anon can rotate without ever reading the
--    row directly.
create or replace function public.set_admin_token(
  p_current text,
  p_new text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expected text;
begin
  if p_new is null or length(btrim(p_new)) < 4 then
    raise exception 'New password must be at least 4 characters'
      using errcode = '22023';
  end if;

  select value into v_expected from public.app_settings where key = 'admin_token';
  if v_expected is null then
    raise exception 'Admin not configured';
  end if;
  if p_current is null or p_current <> v_expected then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  update public.app_settings
     set value = p_new,
         updated_at = now()
   where key = 'admin_token';

  return true;
end;
$$;

revoke all on function public.set_admin_token(text, text) from public;
grant execute on function public.set_admin_token(text, text) to anon, authenticated;

comment on function public.set_admin_token(text, text) is
  'Rotates the analytics admin password. Pass the current password + the new one.';
