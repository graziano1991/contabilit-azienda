import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getCategorySummaries } from "@/lib/data/realities";
import { getTransactionsSummary } from "@/lib/data/transactions";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass } from "@/lib/ui";
import { REALITY_TYPE_LABEL, type RealityType } from "@/lib/reality-types";

export default async function ReportPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const [categorySummaries, transactionsSummary, { data: realityPnl }] = await Promise.all([
    getCategorySummaries(supabase, company.id),
    getTransactionsSummary(supabase, company.id),
    supabase.from("v_reality_pnl").select("*").eq("company_id", company.id).order("profit", { ascending: false }),
  ]);

  const realityRevenue = categorySummaries.reduce((s, c) => s + c.revenue, 0);
  const realityCost = categorySummaries.reduce((s, c) => s + c.cost, 0);
  const closedTxRevenue = transactionsSummary.totalSaleRevenue;
  const closedTxCost = transactionsSummary.list
    .filter((t) => ["venduto", "chiusa"].includes(t.status))
    .reduce((s, t) => s + t.investment, 0);

  const totalRevenue = realityRevenue + closedTxRevenue;
  const totalCost = realityCost + closedTxCost;
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-8">
      <PageHeader title="Report" description="Report economico per singola realtà e report consolidato dell'azienda, calcolati dai dati reali." />

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Totale azienda
        </h3>
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Categoria</th>
                <th className={thClass}>Ricavi</th>
                <th className={thClass}>Costi</th>
                <th className={thClass}>Utile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categorySummaries.map((c) => (
                <tr key={c.type}>
                  <td className={tdClass}>{REALITY_TYPE_LABEL[c.type as RealityType]}</td>
                  <td className={`${tdClass} text-revenue`}>{formatCurrency(c.revenue)}</td>
                  <td className={`${tdClass} text-cost`}>{formatCurrency(c.cost)}</td>
                  <td className={`${tdClass} font-medium text-brand-700`}>{formatCurrency(c.profit)}</td>
                </tr>
              ))}
              <tr>
                <td className={tdClass}>Compravendite (concluse)</td>
                <td className={`${tdClass} text-revenue`}>{formatCurrency(closedTxRevenue)}</td>
                <td className={`${tdClass} text-cost`}>{formatCurrency(closedTxCost)}</td>
                <td className={`${tdClass} font-medium text-brand-700`}>{formatCurrency(closedTxRevenue - closedTxCost)}</td>
              </tr>
              <tr className="bg-neutral-50 font-semibold">
                <td className={tdClass}>Totale azienda</td>
                <td className={`${tdClass} text-revenue`}>{formatCurrency(totalRevenue)}</td>
                <td className={`${tdClass} text-cost`}>{formatCurrency(totalCost)}</td>
                <td className={`${tdClass} text-brand-700`}>{formatCurrency(totalProfit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Report per realtà
        </h3>
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Realtà</th>
                <th className={thClass}>Tipo</th>
                <th className={thClass}>Ricavi</th>
                <th className={thClass}>Costi</th>
                <th className={thClass}>Utile</th>
                <th className={thClass}>Margine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(realityPnl ?? []).map((r) => (
                <tr key={r.reality_id}>
                  <td className={tdClass}>
                    <Link href={`/realta/${r.reality_id}`} className="text-brand-700 hover:underline">
                      {r.name}
                    </Link>
                  </td>
                  <td className={tdClass}>{REALITY_TYPE_LABEL[r.type as RealityType] ?? r.type}</td>
                  <td className={`${tdClass} text-revenue`}>{formatCurrency(r.total_revenue)}</td>
                  <td className={`${tdClass} text-cost`}>{formatCurrency(r.total_cost)}</td>
                  <td className={`${tdClass} font-medium text-brand-700`}>{formatCurrency(r.profit)}</td>
                  <td className={tdClass}>
                    {r.total_revenue > 0 ? formatPercent((r.profit / r.total_revenue) * 100) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Report per compravendita
        </h3>
        <div className={tableWrapperClass}>
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className={thClass}>Operazione</th>
                <th className={thClass}>Stato</th>
                <th className={thClass}>Investimento</th>
                <th className={thClass}>Ricavo vendita</th>
                <th className={thClass}>Utile</th>
                <th className={thClass}>ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactionsSummary.list.map((t) => (
                <tr key={t.id}>
                  <td className={tdClass}>
                    <Link href={`/compravendite/${t.id}`} className="text-brand-700 hover:underline">
                      {t.name}
                    </Link>
                  </td>
                  <td className={tdClass}>{t.status}</td>
                  <td className={tdClass}>{formatCurrency(t.investment)}</td>
                  <td className={`${tdClass} text-revenue`}>{formatCurrency(t.saleRevenue)}</td>
                  <td className={`${tdClass} font-medium text-brand-700`}>{formatCurrency(t.profit)}</td>
                  <td className={tdClass}>{t.investment > 0 ? formatPercent((t.profit / t.investment) * 100) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
