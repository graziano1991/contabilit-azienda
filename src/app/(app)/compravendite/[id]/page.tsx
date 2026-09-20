import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTransactionDetail } from "@/lib/data/transactions";
import { updateTransaction, addTransactionCost } from "@/lib/actions/transactions";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TextField,
  NumberField,
  DateField,
  SelectField,
  FormSection,
} from "@/components/ui/form-field";
import { formatCurrency, formatPercent, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass, inputClass, labelClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";

const STATUS_OPTIONS = [
  { value: "analisi", label: "Analisi" },
  { value: "acquistato", label: "Acquistato" },
  { value: "in_ristrutturazione", label: "In ristrutturazione" },
  { value: "pronto_vendita", label: "Pronto alla vendita" },
  { value: "venduto", label: "Venduto" },
  { value: "chiusa", label: "Chiusa" },
];

const STATUS_TONE: Record<string, "default" | "success" | "warning" | "info"> = {
  analisi: "default",
  acquistato: "info",
  in_ristrutturazione: "warning",
  pronto_vendita: "warning",
  venduto: "success",
  chiusa: "default",
};

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const data = await getTransactionDetail(supabase, id);
  if (!data) notFound();

  const { transaction: t, investment, saleRevenue, profit, roi, marginPct, totalFinancing, debt, costs } = data;

  const durationDays = t.purchase_date
    ? Math.round(
        ((t.sale_date ? new Date(t.sale_date).getTime() : Date.now()) -
          new Date(t.purchase_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">{t.name}</h2>
          <p className="text-sm text-neutral-500">{t.address || "Nessun indirizzo"}</p>
        </div>
        <Badge tone={STATUS_TONE[t.status] ?? "default"}>
          {STATUS_OPTIONS.find((s) => s.value === t.status)?.label ?? t.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Investimento totale" value={formatCurrency(investment)} />
        <KpiCard label="Ricavo vendita" value={formatCurrency(saleRevenue)} tone="revenue" />
        <KpiCard label="Utile lordo" value={formatCurrency(profit)} tone="profit" />
        <KpiCard label="ROI" value={formatPercent(roi)} />
        <KpiCard label="Margine" value={formatPercent(marginPct)} />
        <KpiCard label="Durata operazione" value={durationDays !== null ? `${durationDays} giorni` : "—"} />
      </div>

      <Section title="Finanziamento">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard label="Capitale proprio" value={formatCurrency(t.own_capital)} />
          <KpiCard label="Debito" value={formatCurrency(debt)} tone="cost" />
          <KpiCard label="Totale investimento" value={formatCurrency(totalFinancing)} />
        </div>
      </Section>

      <Section title="Stato e dati operazione">
        <Card className="p-6">
          <form action={updateTransaction} className="space-y-6">
            <input type="hidden" name="id" value={t.id} />

            <FormSection title="Stato">
              <SelectField label="Stato operazione" name="status" defaultValue={t.status} options={STATUS_OPTIONS} />
            </FormSection>

            <FormSection title="Dati acquisto">
              <NumberField label="Prezzo acquisto" name="purchase_price" defaultValue={t.purchase_price ?? 0} suffix="€" />
              <DateField label="Data acquisto" name="purchase_date" defaultValue={t.purchase_date ?? ""} />
              <NumberField label="Notaio" name="purchase_notary_cost" defaultValue={t.purchase_notary_cost ?? 0} suffix="€" />
              <NumberField label="Imposte" name="purchase_taxes" defaultValue={t.purchase_taxes ?? 0} suffix="€" />
              <NumberField label="Agenzia" name="purchase_agency_cost" defaultValue={t.purchase_agency_cost ?? 0} suffix="€" />
              <NumberField label="Costi finanziari" name="purchase_financial_cost" defaultValue={t.purchase_financial_cost ?? 0} suffix="€" />
              <NumberField label="Altri costi" name="purchase_other_cost" defaultValue={t.purchase_other_cost ?? 0} suffix="€" />
            </FormSection>

            <FormSection title="Vendita">
              <NumberField label="Prezzo vendita" name="sale_price" defaultValue={t.sale_price ?? ""} suffix="€" />
              <DateField label="Data vendita" name="sale_date" defaultValue={t.sale_date ?? ""} />
              <NumberField label="Notaio" name="sale_notary_cost" defaultValue={t.sale_notary_cost ?? 0} suffix="€" />
              <NumberField label="Imposte" name="sale_taxes" defaultValue={t.sale_taxes ?? 0} suffix="€" />
              <NumberField label="Agenzia" name="sale_agency_cost" defaultValue={t.sale_agency_cost ?? 0} suffix="€" />
              <NumberField label="Altri costi" name="sale_other_cost" defaultValue={t.sale_other_cost ?? 0} suffix="€" />
            </FormSection>

            <FormSection title="Finanziamento">
              <NumberField label="Capitale proprio" name="own_capital" defaultValue={t.own_capital ?? 0} suffix="€" />
              <NumberField label="Finanziamento bancario" name="bank_financing" defaultValue={t.bank_financing ?? 0} suffix="€" />
              <NumberField label="Finanziamento soci" name="partner_financing" defaultValue={t.partner_financing ?? 0} suffix="€" />
              <NumberField label="Seller financing" name="seller_financing" defaultValue={t.seller_financing ?? 0} suffix="€" />
              <NumberField label="Altri finanziamenti" name="other_financing" defaultValue={t.other_financing ?? 0} suffix="€" />
            </FormSection>

            <div className="flex justify-end">
              <SubmitButton>Salva modifiche</SubmitButton>
            </div>
          </form>
        </Card>
      </Section>

      <Section title="Costi di ristrutturazione e gestione">
        {costs.length > 0 && (
          <div className={`${tableWrapperClass} mb-4`}>
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className={thClass}>Data</th>
                  <th className={thClass}>Fase</th>
                  <th className={thClass}>Categoria</th>
                  <th className={thClass}>Descrizione</th>
                  <th className={thClass}>Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {costs.map((c) => (
                  <tr key={c.id}>
                    <td className={tdClass}>{formatDate(c.cost_date)}</td>
                    <td className={tdClass}>
                      <Badge tone={c.phase === "ristrutturazione" ? "warning" : "default"}>{c.phase}</Badge>
                    </td>
                    <td className={tdClass}>{c.category}</td>
                    <td className={tdClass}>{c.description ?? "—"}</td>
                    <td className={`${tdClass} text-cost`}>{formatCurrency(c.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Card className="p-4">
          <form action={addTransactionCost} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
            <input type="hidden" name="transaction_id" value={t.id} />
            <div className="sm:col-span-1">
              <label className={labelClass}>Fase</label>
              <select name="phase" className={inputClass} defaultValue="ristrutturazione">
                <option value="ristrutturazione">Ristrutturazione</option>
                <option value="gestione">Gestione</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className={labelClass}>Categoria</label>
              <input name="category" className={inputClass} placeholder="Lavori, materiali…" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Descrizione</label>
              <input name="description" className={inputClass} />
            </div>
            <div className="sm:col-span-1">
              <label className={labelClass}>Importo (€)</label>
              <input name="amount" type="number" step="0.01" className={inputClass} />
            </div>
            <div className="sm:col-span-1">
              <SubmitButton className="w-full">Aggiungi</SubmitButton>
            </div>
          </form>
        </Card>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      {children}
    </div>
  );
}
