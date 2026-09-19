import Link from "next/link";
import { Repeat } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  analisi: "Analisi",
  acquistato: "Acquistato",
  in_ristrutturazione: "In ristrutturazione",
  pronto_vendita: "Pronto alla vendita",
  venduto: "Venduto",
  chiusa: "Chiusa",
};

const STATUS_TONE: Record<string, "default" | "success" | "warning" | "info"> = {
  analisi: "default",
  acquistato: "info",
  in_ristrutturazione: "warning",
  pronto_vendita: "warning",
  venduto: "success",
  chiusa: "default",
};

export function TransactionCard({
  id,
  name,
  status,
  investment,
  saleRevenue,
  profit,
}: {
  id: string;
  name: string;
  status: string;
  investment: number;
  saleRevenue: number;
  profit: number;
}) {
  return (
    <Link
      href={`/compravendite/${id}`}
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card-hover active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Repeat className="h-4 w-4" />
          </div>
          <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
        </div>
        <Badge tone={STATUS_TONE[status] ?? "default"}>
          {STATUS_LABEL[status] ?? status}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">
            Investimento
          </p>
          <p className="text-sm font-medium text-neutral-800">
            {formatCurrency(investment)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">
            Ricavo vendita
          </p>
          <p className="text-sm font-medium text-revenue">
            {formatCurrency(saleRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-400">Utile</p>
          <p className="text-sm font-medium text-brand-700">{formatCurrency(profit)}</p>
        </div>
      </div>
    </Link>
  );
}
