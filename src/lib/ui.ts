// Classi Tailwind condivise per i campi dei form e i pulsanti, così ogni
// form/azione dell'app ha lo stesso aspetto — colorato nei toni del logo,
// con più profondità (bordi/ombre più curati) e reattivo al tocco — senza
// ripetere le stesse stringhe ovunque. Modificare questo file cambia
// l'aspetto di ogni bottone e campo di tutta l'app in un colpo solo.
export const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all duration-150 ease-snappy focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15 hover:border-neutral-300";

export const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export const selectClass = inputClass;

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-ambient transition-all duration-150 ease-snappy hover:shadow-glow-lg hover:brightness-110 hover:-translate-y-px active:translate-y-0 active:scale-[0.97] disabled:opacity-60 disabled:hover:brightness-100 disabled:hover:translate-y-0 disabled:active:scale-100";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-150 ease-snappy hover:border-accent-300 hover:bg-accent-50 hover:text-accent-800 hover:-translate-y-px active:translate-y-0 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-cost shadow-sm transition-all duration-150 ease-snappy hover:border-red-300 hover:bg-red-50 hover:-translate-y-px active:translate-y-0 active:scale-[0.97] disabled:opacity-60";

// overflow-x-auto (non overflow-hidden): sulle 13+ pagine che usano questa
// classe le tabelle hanno spesso più colonne di quante ne stiano in uno
// schermo da telefono. Con overflow-hidden le colonne in eccesso venivano
// semplicemente tagliate via, invisibili e non raggiungibili; con
// overflow-x-auto restano tutte lì, si scorre orizzontalmente per vederle.
export const tableWrapperClass =
  "overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-ambient";

export const thClass =
  "border-b border-neutral-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

export const tdClass = "px-4 py-3.5 text-sm text-neutral-700";

export const tableRowHoverClass = "transition-colors hover:bg-accent-50/60";
