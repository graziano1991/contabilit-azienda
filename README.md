# FinanzaCore

Gestionale aziendale privato: contabilità + immobili (affitti brevi, appartamenti,
hotel/strutture) + compravendite immobiliari, con ogni realtà gestita in modo
indipendente e una contabilità centrale filtrabile per realtà.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth) come unico backend
- **Vercel** per il deploy automatico da GitHub

## Setup locale

```bash
npm install
cp .env.example .env.local   # compila con i valori del tuo progetto Supabase
npm run dev
```

## Setup Supabase (una tantum)

1. Crea un progetto su [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copia `Project URL`, `anon public key` e
   `service_role key` in `.env.local` (e nelle Environment Variables di
   Vercel quando fai il deploy).
3. In **SQL Editor**, esegui il contenuto di
   `supabase/migrations/0001_init.sql`. Crea tutte le tabelle, le viste di
   calcolo (`v_reality_pnl`, `v_transaction_pnl`, `v_company_pnl`) e le
   policy di Row Level Security che isolano i dati per azienda.
4. In **Authentication → Providers**, l'email/password è già attiva di
   default: è il metodo di login usato dall'app.

Al primo accesso, l'app chiede di creare l'azienda (schermata "Crea la tua
azienda"): da lì in poi tutti i dati inseriti sono automaticamente collegati
a quell'azienda.

## Deploy su Vercel

1. Collega il repository GitHub da [vercel.com](https://vercel.com) → "Add
   New Project".
2. Aggiungi le stesse variabili d'ambiente di `.env.local` nelle Environment
   Variables del progetto Vercel.
3. Ogni push su `main` fa un deploy automatico.

## Struttura del progetto

```
src/
  app/
    (app)/            # tutte le pagine autenticate (sidebar + topbar)
      dashboard/
      immobili/        # Tutte le realtà, Affitti Brevi, Appartamenti, Hotel
      realta/[id]/     # scheda dettagliata di una singola realtà
      compravendite/   # Operazioni, Acquisti, Vendite + scheda operazione
      contabilita/     # Prima Nota, Piano dei Conti, Fatture, Clienti, ...
      report/
      documenti/
      impostazioni/
    login/
    onboarding/
  components/          # Sidebar, Topbar, card, elementi UI condivisi
  lib/
    supabase/          # client Supabase (browser + server)
    data/               # query di lettura, raggruppate per dominio
    actions/            # Server Actions per le operazioni di scrittura
supabase/
  migrations/0001_init.sql   # schema completo del database
```

## Concetto architetturale

```
AZIENDA
  -> REALTÀ (affitto breve / appartamento / hotel) oppure OPERAZIONE (compravendita)
    -> CONTABILITÀ (movimenti, fatture, pagamenti — sempre filtrabili per realtà)
```

Ogni realtà e ogni operazione ha un proprio ID indipendente; ricavi, costi,
fatture, pagamenti e documenti si collegano sempre a quell'ID, così i dati
non si mescolano mai tra realtà diverse mantenendo comunque una contabilità
aziendale unica e consolidata.

## Stato attuale e prossimi passi

Questa prima versione copre l'intera navigazione (nessuna voce del menu è
vuota), la creazione e la lettura di tutte le entità principali, i calcoli
automatici (utile, ROI, margine, IVA, cash) e la sicurezza a livello di riga
per azienda. Aree previste per le prossime iterazioni: calendario
prenotazioni, gestione camere hotel con stato per singola camera,
caricamento reale dei documenti su Supabase Storage, grafici sulle pagine di
dettaglio, riconciliazione bancaria.
