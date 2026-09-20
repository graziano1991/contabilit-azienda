// Classi Tailwind condivise per i campi dei form, i pulsanti e le tabelle,
// così ogni form/azione/tabella dell'app ha lo stesso aspetto — modificare
// questo file cambia l'aspetto di ogni bottone, campo e tabella di tutta
// l'app in un colpo solo. Rifatto per la nuova identità visiva "ultra
// premium" scura: superfici in vetro (bg-white a bassissima opacità +
// backdrop-blur invece di bg-white pieno), gradiente viola→fucsia→ciano sul
// bottone primario con vero glow, micro-interazioni su ogni stato
// (hover/active/disabled), tutto costruito solo con transform/opacity/
// background-position per restare performante.
export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner-glow backdrop-blur-sm transition-all duration-150 ease-snappy placeholder:text-neutral-500 focus:border-accent-500/60 focus:outline-none focus:ring-4 focus:ring-accent-500/20 hover:border-white/20";

export const labelClass = "mb-1.5 block text-sm font-medium text-neutral-400";

export const selectClass = inputClass;

// Bottone primario: gradiente animato viola → fucsia → ciano che "scorre"
// al passaggio del mouse (bg-position in transizione, non un vero video/gif:
// costa quanto una transizione di colore), glow che si intensifica in
// hover, leggero sollevamento, feedback di pressione al click.
export const primaryButtonClass =
  "relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-premium-gradient bg-[length:180%_180%] bg-[position:0%_50%] px-4 py-2.5 text-sm font-semibold text-white shadow-glow ring-1 ring-inset ring-white/15 transition-all duration-300 ease-snappy hover:bg-[position:100%_50%] hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-glow disabled:active:scale-100";

// Bottone secondario: superficie "vetro" (bordo quasi invisibile, sfondo
// semi-trasparente) che si illumina di ciano al passaggio del mouse invece
// di un grigio piatto.
export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-neutral-700 backdrop-blur-sm shadow-sm transition-all duration-200 ease-snappy hover:border-accent-500/40 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 hover:shadow-glow-cyan active:translate-y-0 active:scale-[0.97] disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100";

// Bottone di pericolo: stessa logica "vetro" ma tinta rosa/rossa, con glow
// coerente invece del bordo rosso piatto di prima.
export const dangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-cost backdrop-blur-sm shadow-sm transition-all duration-200 ease-snappy hover:border-rose-400/50 hover:bg-rose-500/20 hover:-translate-y-0.5 hover:shadow-glow-rose active:translate-y-0 active:scale-[0.97] disabled:opacity-50";

// overflow-x-auto (non overflow-hidden): sulle 13+ pagine che usano questa
// classe le tabelle hanno spesso più colonne di quante ne stiano in uno
// schermo da telefono. Con overflow-hidden le colonne in eccesso venivano
// semplicemente tagliate via, invisibili e non raggiungibili; con
// overflow-x-auto restano tutte lì, si scorre orizzontalmente per vederle.
export const tableWrapperClass =
  "overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-ambient backdrop-blur-sm";

export const thClass =
  "border-b border-white/10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500";

export const tdClass = "px-4 py-3.5 text-sm text-neutral-700";

export const tableRowHoverClass = "transition-colors hover:bg-white/[0.045]";
