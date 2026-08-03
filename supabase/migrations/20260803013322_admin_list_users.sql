-- Same gate and reasoning as admin_stats() (see baseline migration), but
-- this one deliberately does expose individual identities — username,
-- email, signup date — since that's exactly what was asked for. Still
-- nothing beyond those three fields: no progress, no Player Card, no
-- playbook contents.
create or replace function public.admin_list_users()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if auth.email() is distinct from 'dgreatjosh123@gmail.com' then
    raise exception 'not authorized';
  end if;

  select coalesce(json_agg(row_to_json(u) order by u.created_at desc), '[]'::json)
  into result
  from (
    select username, email, created_at
    from public.profiles
  ) as u;

  return result;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;
