import type { LucideIcon } from "lucide-react";

// Intestazione di pagina condivisa da (quasi) ogni pagina dell'app: cambiare
// questo file da solo ristruttura visivamente l'intero prodotto. Rispetto
// alla versione precedente (barretta verticale + titolo impilato sopra la
// action), qui l'icona di sezione (quando passata) diventa un vero badge
// a sinistra del titolo, e su schermi larghi titolo/azione stanno sulla
// stessa riga invece che impilati: più "cruscotto app", meno "documento".
export function PageHeader({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-7 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        {Icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-premium-gradient-soft shadow-glow ring-1 ring-inset ring-white/10">
            <Icon className="h-5 w-5 text-white" />
          </div>
        ) : (
          <span className="h-7 w-1.5 shrink-0 rounded-full bg-premium-gradient shadow-glow" />
        )}
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
