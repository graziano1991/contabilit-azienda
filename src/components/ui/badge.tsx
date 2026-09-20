import clsx from "clsx";

// Pillole "vetro" colorate invece dei vecchi badge pastello piatti: sfondo
// del colore a bassissima opacità (si legge come un tint sul vetro scuro,
// non come un rettangolo pieno) + anello sottile + pallino acceso, coerenti
// con l'identità cromatica vivace ma "elegante" richiesta.
const TONE_CLASSES: Record<string, string> = {
  default: "bg-white/8 text-neutral-600 ring-1 ring-inset ring-white/10",
  success: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25",
  danger: "bg-rose-500/10 text-cost ring-1 ring-inset ring-rose-500/25",
  info: "bg-brand-500/10 text-brand-700 ring-1 ring-inset ring-brand-500/25",
};

const DOT_CLASSES: Record<string, string> = {
  default: "bg-neutral-500",
  success: "bg-emerald-400 shadow-glow-emerald",
  warning: "bg-amber-400",
  danger: "bg-rose-400 shadow-glow-rose",
  info: "bg-brand-500 shadow-glow",
};

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm",
        TONE_CLASSES[tone]
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", DOT_CLASSES[tone])} />
      {children}
    </span>
  );
}
