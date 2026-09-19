// Classi Tailwind condivise per i campi dei form e i pulsanti, così ogni
// form/azione dell'app ha lo stesso aspetto — colorato nei toni del logo e
// reattivo al tocco — senza ripetere le stesse stringhe ovunque.
export const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-all focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 hover:border-neutral-400";

export const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export const selectClass = inputClass;

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 ease-snappy hover:shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:hover:brightness-100 disabled:active:scale-100";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-150 ease-snappy hover:border-accent-400 hover:bg-accent-50 hover:text-accent-800 active:scale-95 disabled:opacity-60 disabled:active:scale-100";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-cost shadow-sm transition-all duration-150 ease-snappy hover:bg-red-50 active:scale-95 disabled:opacity-60";

// overflow-x-auto (non overflow-hidden): sulle 13+ pagine che usano questa
// classe le tabelle hanno spesso più colonne di quante ne stiano in uno
// schermo da telefono. Con overflow-hidden le colonne in eccesso venivano
// semplicemente tagliate via, invisibili e non raggiungibili; con
// overflow-x-auto restano tutte lì, si scorre orizzontalmente per vederle.
export const tableWrapperClass =
  "overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-card";

export const thClass =
  "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500";

export const tdClass = "px-4 py-3 text-sm text-neutral-700";

export const tableRowHoverClass = "transition-colors hover:bg-accent-50/60";
