-- Aggiunge l'email alla tabella company_users, così l'app può mostrare
-- l'elenco delle persone registrate senza dover leggere auth.users
-- direttamente (non accessibile dal client). Viene valorizzata quando un
-- utente si iscrive o entra a far parte dell'azienda.
alter table company_users add column if not exists email text;
