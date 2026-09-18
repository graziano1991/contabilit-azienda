import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { RealityCard } from "@/components/reality-card";
import { primaryButtonClass } from "@/lib/ui";
import { REALITY_TYPE_LABEL, type RealityType } from "@/lib/reality-types";
import type { RealityListItem } from "@/lib/data/realities";

export function RealityCategoryView({
  type,
  description,
  newHref,
  items,
}: {
  type: RealityType;
  description: string;
  newHref: string;
  items: RealityListItem[];
}) {
  return (
    <div>
      <PageHeader
        title={REALITY_TYPE_LABEL[type]}
        description={description}
        action={
          <Link href={newHref} className={primaryButtonClass}>
            <Plus className="h-4 w-4" />
            Aggiungi {REALITY_TYPE_LABEL[type].toLowerCase()}
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title={`Nessun${type === "appartamento" ? "" : "a"} ${REALITY_TYPE_LABEL[type].toLowerCase()} ancora`}
          description="Ogni realtà è indipendente: crea la prima per iniziare a tracciarne ricavi e costi."
          action={
            <Link href={newHref} className={primaryButtonClass}>
              <Plus className="h-4 w-4" />
              Aggiungi
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((r) => (
            <RealityCard
              key={r.id}
              id={r.id}
              name={r.name}
              type={r.type}
              revenue={r.revenue}
              cost={r.cost}
              profit={r.profit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
