create table if not exists public.administrators (email text primary key check (email = lower(email)));
alter table public.administrators enable row level security;
revoke all on public.administrators from anon, authenticated;
grant select on public.administrators to service_role;
