-- Risolve il problema per cui un utente nuovo non può né leggere né creare
-- un'azienda tramite le policy RLS esistenti (blocco "chi crea per primo la
-- riga a cui deve appartenere per avere il permesso di crearla"). Questa
-- funzione gira con privilegi elevati (security definer) e fa in modo
-- controllato una sola cosa: collega l'utente che la chiama all'unica
-- azienda condivisa dell'app (creandola se è la primissima persona di
-- sempre a registrarsi). Nessuna logica di creazione resta lato app: il
-- flusso utente è solo "registrati con email + password + codice, poi
-- entra nell'app".

alter table company_users add column if not exists email text;

create or replace function join_default_company(user_email text)
returns table (id uuid, name text, role text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_role text;
begin
  -- L'utente è già membro di un'azienda? (login successivi)
  select cu.company_id, cu.role into v_company_id, v_role
  from company_users cu
  where cu.user_id = auth.uid()
  limit 1;

  if v_company_id is not null then
    return query select c.id, c.name, v_role from companies c where c.id = v_company_id;
    return;
  end if;

  -- Prende l'unica azienda esistente, se c'è già.
  select c.id into v_company_id from companies c order by c.created_at asc limit 1;

  if v_company_id is null then
    insert into companies (name) values ('La mia azienda') returning companies.id into v_company_id;
    v_role := 'admin';
  else
    v_role := 'editor';
  end if;

  insert into company_users (company_id, user_id, role, email)
  values (v_company_id, auth.uid(), v_role, user_email);

  return query select c.id, c.name, v_role from companies c where c.id = v_company_id;
end;
$$;

revoke all on function join_default_company(text) from public;
grant execute on function join_default_company(text) to authenticated;
