// Classi Tailwind condivise per i campi dei form, così ogni form dell'app
// ha lo stesso aspetto senza ripetere le stesse stringhe ovunque.
export const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export const selectClass = inputClass;

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50";

export const tableWrapperClass =
  "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card";

export const thClass =
  "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-neutral-500";

export const tdClass = "px-4 py-3 text-sm text-neutral-700";
