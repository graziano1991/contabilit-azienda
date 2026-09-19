-- Secondo livello di sicurezza obbligatorio: dopo la registrazione, prima
-- di poter accedere a qualunque pagina dell'app, l'utente deve superare una
-- verifica con una password di sicurezza separata da quella personale. Lo
-- stato di verifica è salvato lato database (non aggirabile modificando il
-- frontend) e, una volta superato, resta valido per sempre per quell'utente.

alter table company_users
  add column if not exists security_verified boolean not null default false;

-- La funzione join_default_company deve restituire anche questo stato,
-- quindi va ricreata (il tipo di ritorno cambia: serve prima droppare).
drop function if exists join_default_company(text);

create function join_default_company(user_email text)
returns table (id uuid, name text, role text, security_verified boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_role text;
  v_verified boolean;
begin
  select cu.company_id, cu.role, cu.security_verified
  into v_company_id, v_role, v_verified
  from company_users cu
  where cu.user_id = auth.uid()
  limit 1;

  if v_company_id is not null then
    return query
      select c.id, c.name, v_role, v_verified
      from companies c
      where c.id = v_company_id;
    return;
  end if;

  select c.id into v_company_id from companies c order by c.created_at asc limit 1;

  if v_company_id is null then
    insert into companies (name) values ('La mia azienda') returning companies.id into v_company_id;
    v_role := 'admin';
  else
    v_role := 'editor';
  end if;

  insert into company_users (company_id, user_id, role, email, security_verified)
  values (v_company_id, auth.uid(), v_role, user_email, false);

  return query
    select c.id, c.name, v_role, false
    from companies c
    where c.id = v_company_id;
end;
$$;

revoke all on function join_default_company(text) from public;
grant execute on function join_default_company(text) to authenticated;
