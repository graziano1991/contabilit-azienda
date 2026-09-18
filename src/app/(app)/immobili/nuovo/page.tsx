import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { REALITY_TYPE_LABEL, REALITY_TYPE_ICON } from "@/lib/reality-types";

const OPTIONS = [
  {
    type: "affitto_breve" as const,
    href: "/immobili/nuovo/affitto-breve",
    description: "Appartamento gestito su Airbnb, Booking o prenotazioni dirette.",
  },
  {
    type: "appartamento" as const,
    href: "/immobili/nuovo/appartamento",
    description: "Immobile residenziale o a reddito, canone o mutuo da tracciare.",
  },
  {
    type: "hotel" as const,
    href: "/immobili/nuovo/hotel",
    description: "Hotel, residence o struttura ricettiva con più camere.",
  },
];

export default function NuovaRealtaPage() {
  return (
    <div>
      <PageHeader title="Cosa vuoi aggiungere?" description="Scegli il tipo di realtà: ognuna ha una scheda dedicata." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const Icon = REALITY_TYPE_ICON[opt.type];
          return (
            <Link
              key={opt.type}
              href={opt.href}
              className="flex flex-col items-start rounded-2xl border border-neutral-200 bg-white p-5 shadow-card transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-neutral-900">
                {REALITY_TYPE_LABEL[opt.type]}
              </p>
              <p className="mt-1 text-xs text-neutral-500">{opt.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
