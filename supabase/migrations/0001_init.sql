-- ============================================================================
-- FinanzaCore — schema iniziale
-- Gestionale aziendale: contabilità + immobili (affitti brevi, appartamenti,
-- hotel/strutture) + compravendite immobiliari.
--
-- Concetto: AZIENDA -> REALTA'/OPERAZIONI -> CONTABILITA'
-- Ogni record economico (fattura, pagamento, movimento) porta sempre
-- company_id e, quando pertinente, reality_id oppure transaction_id, così
-- da poter filtrare la contabilità per singola realtà senza mai mescolare i
-- dati tra realtà diverse.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. AZIENDA E UTENTI
-- ----------------------------------------------------------------------------

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  tax_code text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 2. REALTA' (entità comune a Affitti Brevi / Appartamenti / Hotel)
-- ----------------------------------------------------------------------------
-- Ogni riga qui è una "realtà" indipendente. Il campo `type` decide quale
-- tabella di dettaglio (short_term_rentals / apartments / hotels) la
-- accompagna 1:1. Interfaccia e navigazione trattano i tre tipi come sezioni
-- separate, anche se condividono questa tabella e la contabilità.

create table realities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  code text, -- es. "REALTA #001" mostrato in UI, generato lato app
  type text not null check (type in ('affitto_breve', 'appartamento', 'hotel')),
  name text not null,
  address text,
  city text,
  postal_code text,
  province text,
  owner text,
  manager text,
  start_date date,
  status text not null default 'attiva' check (status in ('attiva', 'inattiva', 'in_ristrutturazione', 'chiusa')),
  cover_image_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_realities_company on realities(company_id);
create index idx_realities_type on realities(company_id, type);

-- Dettaglio Affitti Brevi
create table short_term_rentals (
  reality_id uuid primary key references realities(id) on delete cascade,
  sqm numeric(8,2),
  bedrooms integer,
  beds integer,
  rent_cost numeric(12,2) default 0,       -- canone affitto (se in locazione)
  mortgage_cost numeric(12,2) default 0,   -- mutuo
  utilities_cost numeric(12,2) default 0,  -- utenze
  condo_fees numeric(12,2) default 0,      -- condominio
  cleaning_cost numeric(12,2) default 0,
  platform_fees_pct numeric(5,2) default 0, -- commissione piattaforme %
  maintenance_cost numeric(12,2) default 0,
  insurance_cost numeric(12,2) default 0,
  tax_cost numeric(12,2) default 0
);

-- Dettaglio Appartamenti (immobili a reddito / residenziali, non affitto breve)
create table apartments (
  reality_id uuid primary key references realities(id) on delete cascade,
  cadastral_data text, -- dati catastali
  sqm numeric(8,2),
  rooms integer,
  market_value numeric(14,2),
  rent_income numeric(12,2) default 0,     -- canone incassato
  mortgage_cost numeric(12,2) default 0,
  condo_fees numeric(12,2) default 0,
  insurance_cost numeric(12,2) default 0,
  tax_cost numeric(12,2) default 0
);

-- Dettaglio Hotel / Strutture ricettive
create table hotels (
  reality_id uuid primary key references realities(id) on delete cascade,
  category text,            -- es. 3 stelle, 4 stelle
  num_rooms integer,
  num_beds integer,
  opening_date date
);

create table hotel_rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_reality_id uuid not null references realities(id) on delete cascade,
  room_number text not null,
  room_type text,
  capacity integer,
  status text not null default 'disponibile' check (status in ('disponibile', 'occupata', 'manutenzione', 'fuori_servizio')),
  created_at timestamptz not null default now(),
  unique (hotel_reality_id, room_number)
);

create index idx_hotel_rooms_reality on hotel_rooms(hotel_reality_id);

-- ----------------------------------------------------------------------------
-- 3. PRENOTAZIONI (Affitti Brevi e Hotel)
-- ----------------------------------------------------------------------------

create table reservations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid not null references realities(id) on delete cascade,
  hotel_room_id uuid references hotel_rooms(id) on delete set null,
  guest_name text not null,
  platform text check (platform in ('airbnb', 'booking', 'diretta', 'altra_piattaforma')),
  check_in date not null,
  check_out date not null,
  nights integer generated always as (check_out - check_in) stored,
  gross_price numeric(12,2) not null default 0,
  commission numeric(12,2) not null default 0,
  net_revenue numeric(12,2) generated always as (gross_price - commission) stored,
  payment_status text not null default 'da_incassare' check (payment_status in ('da_incassare', 'incassato', 'parziale')),
  status text not null default 'confermata' check (status in ('confermata', 'in_corso', 'completata', 'cancellata')),
  notes text,
  created_at timestamptz not null default now()
);

create index idx_reservations_reality on reservations(reality_id);
create index idx_reservations_dates on reservations(reality_id, check_in, check_out);

-- ----------------------------------------------------------------------------
-- 4. COMPRAVENDITE (operazioni acquisto/ristrutturazione/vendita)
-- ----------------------------------------------------------------------------

create table property_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  code text, -- es. "OPERAZIONE #001"
  name text not null,
  address text,
  property_type text,
  status text not null default 'analisi' check (status in ('analisi', 'acquistato', 'in_ristrutturazione', 'pronto_vendita', 'venduto', 'chiusa')),

  -- Acquisto
  purchase_price numeric(14,2) default 0,
  purchase_date date,
  purchase_notary_cost numeric(12,2) default 0,
  purchase_taxes numeric(12,2) default 0,
  purchase_agency_cost numeric(12,2) default 0,
  purchase_financial_cost numeric(12,2) default 0,
  purchase_other_cost numeric(12,2) default 0,

  -- Vendita
  expected_sale_price numeric(14,2),
  expected_sale_date date,
  sale_price numeric(14,2),
  sale_date date,
  sale_notary_cost numeric(12,2) default 0,
  sale_taxes numeric(12,2) default 0,
  sale_agency_cost numeric(12,2) default 0,
  sale_other_cost numeric(12,2) default 0,

  -- Finanziamento
  own_capital numeric(14,2) default 0,
  bank_financing numeric(14,2) default 0,
  partner_financing numeric(14,2) default 0,
  seller_financing numeric(14,2) default 0,
  other_financing numeric(14,2) default 0,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_transactions_company on property_transactions(company_id);

-- Costi dell'operazione, suddivisi per fase (ristrutturazione / gestione,
-- oltre a quelli già sintetici sulla riga principale per acquisto/vendita)
create table property_transaction_costs (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references property_transactions(id) on delete cascade,
  phase text not null check (phase in ('ristrutturazione', 'gestione')),
  category text not null, -- lavori, materiali, tecnici, permessi, arredamento, utenze, assicurazione, condominio, tasse, altro
  description text,
  amount numeric(12,2) not null default 0,
  cost_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_tx_costs_transaction on property_transaction_costs(transaction_id);

-- Eventuali ricavi intermedi dell'operazione (es. affitto temporaneo durante
-- l'attesa della vendita) — separati dal prezzo di vendita finale
create table property_transaction_revenues (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references property_transactions(id) on delete cascade,
  description text,
  amount numeric(12,2) not null default 0,
  revenue_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_tx_revenues_transaction on property_transaction_revenues(transaction_id);

-- ----------------------------------------------------------------------------
-- 5. ANAGRAFICHE
-- ----------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  vat_number text,
  tax_code text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  vat_number text,
  tax_code text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_customers_company on customers(company_id);
create index idx_suppliers_company on suppliers(company_id);

-- ----------------------------------------------------------------------------
-- 6. PIANO DEI CONTI (semplice: categoria ricavo/costo, non doppia partita
--    obbligatoria per l'utente — la UI mostra solo "categoria + importo")
-- ----------------------------------------------------------------------------

create table chart_of_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  code text,
  name text not null,
  account_type text not null check (account_type in ('ricavo', 'costo', 'attivo', 'passivo', 'patrimonio_netto')),
  parent_id uuid references chart_of_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (company_id, code)
);

create index idx_accounts_company on chart_of_accounts(company_id);

-- ----------------------------------------------------------------------------
-- 7. FATTURE
-- ----------------------------------------------------------------------------

create table invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  direction text not null check (direction in ('emessa', 'ricevuta')), -- emessa = a cliente, ricevuta = da fornitore
  number text,
  customer_id uuid references customers(id) on delete set null,
  supplier_id uuid references suppliers(id) on delete set null,
  issue_date date not null default current_date,
  due_date date,
  taxable_amount numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 22,
  vat_amount numeric(12,2) generated always as (round(taxable_amount * vat_rate / 100, 2)) stored,
  total_amount numeric(12,2) generated always as (taxable_amount + round(taxable_amount * vat_rate / 100, 2)) stored,
  status text not null default 'da_incassare' check (status in ('da_incassare', 'da_pagare', 'incassata', 'pagata', 'scaduta', 'annullata')),
  category text, -- collega al piano dei conti in modo leggibile, es. "Affitto breve"
  account_id uuid references chart_of_accounts(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_invoices_company on invoices(company_id);
create index idx_invoices_reality on invoices(reality_id);
create index idx_invoices_transaction on invoices(transaction_id);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) generated always as (quantity * unit_price) stored
);

create index idx_invoice_items_invoice on invoice_items(invoice_id);

-- ----------------------------------------------------------------------------
-- 8. BANCHE, CASSA, PAGAMENTI
-- ----------------------------------------------------------------------------

create table bank_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  iban text,
  bank_name text,
  currency text not null default 'EUR',
  opening_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table bank_transactions (
  id uuid primary key default gen_random_uuid(),
  bank_account_id uuid not null references bank_accounts(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  tx_date date not null default current_date,
  description text,
  direction text not null check (direction in ('entrata', 'uscita')),
  amount numeric(12,2) not null default 0,
  category text,
  reconciled boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_bank_tx_account on bank_transactions(bank_account_id);
create index idx_bank_tx_reality on bank_transactions(reality_id);

create table cash_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  tx_date date not null default current_date,
  description text,
  direction text not null check (direction in ('entrata', 'uscita')),
  amount numeric(12,2) not null default 0,
  category text,
  created_at timestamptz not null default now()
);

create index idx_cash_tx_company on cash_transactions(company_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete set null,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  direction text not null check (direction in ('incasso', 'pagamento')),
  amount numeric(12,2) not null default 0,
  pay_date date not null default current_date,
  method text check (method in ('bonifico', 'contanti', 'carta', 'assegno', 'altro')),
  bank_account_id uuid references bank_accounts(id) on delete set null,
  status text not null default 'completato' check (status in ('completato', 'in_attesa', 'annullato')),
  created_at timestamptz not null default now()
);

create index idx_payments_company on payments(company_id);
create index idx_payments_reality on payments(reality_id);

-- ----------------------------------------------------------------------------
-- 9. PRIMA NOTA (movimenti contabili semplici, con eventuale suddivisione
--    per conto tramite le righe)
-- ----------------------------------------------------------------------------

create table accounting_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  invoice_id uuid references invoices(id) on delete set null,
  entry_date date not null default current_date,
  description text not null,
  direction text not null check (direction in ('ricavo', 'costo')),
  amount numeric(12,2) not null default 0,
  account_id uuid references chart_of_accounts(id) on delete set null,
  payment_method text,
  created_at timestamptz not null default now()
);

create index idx_entries_company on accounting_entries(company_id);
create index idx_entries_reality on accounting_entries(reality_id);
create index idx_entries_transaction on accounting_entries(transaction_id);

-- Righe di dettaglio opzionali, per suddividere un movimento su più conti
create table accounting_entry_lines (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references accounting_entries(id) on delete cascade,
  account_id uuid references chart_of_accounts(id) on delete set null,
  amount numeric(12,2) not null default 0,
  description text
);

create index idx_entry_lines_entry on accounting_entry_lines(entry_id);

-- ----------------------------------------------------------------------------
-- 10. SCADENZE
-- ----------------------------------------------------------------------------

create table due_dates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  invoice_id uuid references invoices(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  supplier_id uuid references suppliers(id) on delete set null,
  description text not null,
  due_date date not null,
  amount numeric(12,2) not null default 0,
  type text not null check (type in ('da_incassare', 'da_pagare')),
  status text not null default 'aperta' check (status in ('aperta', 'saldata', 'scaduta')),
  created_at timestamptz not null default now()
);

create index idx_due_dates_company on due_dates(company_id, status);

-- ----------------------------------------------------------------------------
-- 11. DOCUMENTI
-- ----------------------------------------------------------------------------

create table documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  reality_id uuid references realities(id) on delete set null,
  transaction_id uuid references property_transactions(id) on delete set null,
  name text not null,
  file_path text not null, -- percorso nello storage Supabase
  category text,
  uploaded_at timestamptz not null default now()
);

create index idx_documents_reality on documents(reality_id);
create index idx_documents_transaction on documents(transaction_id);

-- ----------------------------------------------------------------------------
-- 12. CENTRI DI COSTO (facoltativo, oltre a realtà/operazioni)
-- ----------------------------------------------------------------------------

create table cost_centers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 13. AUDIT LOG
-- ----------------------------------------------------------------------------

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index idx_audit_company on audit_logs(company_id, created_at desc);

-- ============================================================================
-- VISTE: aggregati usati da Dashboard e Report (calcolati sempre dai dati
-- reali, mai hardcoded)
-- ============================================================================

-- Ricavi/costi per realtà (affitti brevi + appartamenti + hotel), da prima
-- nota + prenotazioni, cioè la fonte unica di verità sono accounting_entries
create view v_reality_pnl as
select
  r.id as reality_id,
  r.company_id,
  r.type,
  r.name,
  coalesce(sum(e.amount) filter (where e.direction = 'ricavo'), 0) as total_revenue,
  coalesce(sum(e.amount) filter (where e.direction = 'costo'), 0) as total_cost,
  coalesce(sum(e.amount) filter (where e.direction = 'ricavo'), 0)
    - coalesce(sum(e.amount) filter (where e.direction = 'costo'), 0) as profit
from realities r
left join accounting_entries e on e.reality_id = r.id
group by r.id, r.company_id, r.type, r.name;

-- Ricavi/costi per operazione di compravendita: separato dal P&L delle
-- realtà a reddito, come richiesto (non va confuso con l'utile aziendale)
create view v_transaction_pnl as
select
  t.id as transaction_id,
  t.company_id,
  t.name,
  t.status,
  t.purchase_price
    + t.purchase_notary_cost + t.purchase_taxes + t.purchase_agency_cost
    + t.purchase_financial_cost + t.purchase_other_cost
    + coalesce((select sum(c.amount) from property_transaction_costs c where c.transaction_id = t.id), 0)
    as total_investment,
  coalesce(t.sale_price, 0)
    + coalesce((select sum(rv.amount) from property_transaction_revenues rv where rv.transaction_id = t.id), 0)
    - (t.sale_notary_cost + t.sale_taxes + t.sale_agency_cost + t.sale_other_cost)
    as total_sale_revenue,
  (
    coalesce(t.sale_price, 0)
      + coalesce((select sum(rv.amount) from property_transaction_revenues rv where rv.transaction_id = t.id), 0)
      - (t.sale_notary_cost + t.sale_taxes + t.sale_agency_cost + t.sale_other_cost)
  ) - (
    t.purchase_price
      + t.purchase_notary_cost + t.purchase_taxes + t.purchase_agency_cost
      + t.purchase_financial_cost + t.purchase_other_cost
      + coalesce((select sum(c.amount) from property_transaction_costs c where c.transaction_id = t.id), 0)
  ) as gross_profit
from property_transactions t;

-- Panoramica aziendale complessiva (realtà a reddito + compravendite)
create view v_company_pnl as
select
  c.id as company_id,
  coalesce((select sum(total_revenue) from v_reality_pnl where company_id = c.id), 0)
    + coalesce((select sum(total_sale_revenue) from v_transaction_pnl where company_id = c.id and status = 'venduto'), 0)
    as total_revenue,
  coalesce((select sum(total_cost) from v_reality_pnl where company_id = c.id), 0)
    + coalesce((select sum(total_investment) from v_transaction_pnl where company_id = c.id and status = 'venduto'), 0)
    as total_cost,
  coalesce((select sum(profit) from v_reality_pnl where company_id = c.id), 0)
    + coalesce((select sum(gross_profit) from v_transaction_pnl where company_id = c.id and status = 'venduto'), 0)
    as total_profit
from companies c;

-- ============================================================================
-- ROW LEVEL SECURITY: ogni tabella è visibile/modificabile solo da chi
-- appartiene alla company (tramite company_users)
-- ============================================================================

create or replace function is_company_member(target_company_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from company_users cu
    where cu.company_id = target_company_id
      and cu.user_id = auth.uid()
  );
$$;

alter table companies enable row level security;
alter table company_users enable row level security;
alter table realities enable row level security;
alter table short_term_rentals enable row level security;
alter table apartments enable row level security;
alter table hotels enable row level security;
alter table hotel_rooms enable row level security;
alter table reservations enable row level security;
alter table property_transactions enable row level security;
alter table property_transaction_costs enable row level security;
alter table property_transaction_revenues enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table chart_of_accounts enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table bank_accounts enable row level security;
alter table bank_transactions enable row level security;
alter table cash_transactions enable row level security;
alter table payments enable row level security;
alter table accounting_entries enable row level security;
alter table accounting_entry_lines enable row level security;
alter table due_dates enable row level security;
alter table documents enable row level security;
alter table cost_centers enable row level security;
alter table audit_logs enable row level security;

create policy "member access" on companies
  for all using (is_company_member(id)) with check (is_company_member(id));

create policy "member access" on company_users
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on realities
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on short_term_rentals
  for all using (is_company_member((select company_id from realities where id = reality_id)))
  with check (is_company_member((select company_id from realities where id = reality_id)));

create policy "member access" on apartments
  for all using (is_company_member((select company_id from realities where id = reality_id)))
  with check (is_company_member((select company_id from realities where id = reality_id)));

create policy "member access" on hotels
  for all using (is_company_member((select company_id from realities where id = reality_id)))
  with check (is_company_member((select company_id from realities where id = reality_id)));

create policy "member access" on hotel_rooms
  for all using (is_company_member((select company_id from realities where id = hotel_reality_id)))
  with check (is_company_member((select company_id from realities where id = hotel_reality_id)));

create policy "member access" on reservations
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on property_transactions
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on property_transaction_costs
  for all using (is_company_member((select company_id from property_transactions where id = transaction_id)))
  with check (is_company_member((select company_id from property_transactions where id = transaction_id)));

create policy "member access" on property_transaction_revenues
  for all using (is_company_member((select company_id from property_transactions where id = transaction_id)))
  with check (is_company_member((select company_id from property_transactions where id = transaction_id)));

create policy "member access" on customers
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on suppliers
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on chart_of_accounts
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on invoices
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on invoice_items
  for all using (is_company_member((select company_id from invoices where id = invoice_id)))
  with check (is_company_member((select company_id from invoices where id = invoice_id)));

create policy "member access" on bank_accounts
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on bank_transactions
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on cash_transactions
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on payments
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on accounting_entries
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on accounting_entry_lines
  for all using (is_company_member((select company_id from accounting_entries where id = entry_id)))
  with check (is_company_member((select company_id from accounting_entries where id = entry_id)));

create policy "member access" on due_dates
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on documents
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on cost_centers
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));

create policy "member access" on audit_logs
  for all using (is_company_member(company_id)) with check (is_company_member(company_id));
