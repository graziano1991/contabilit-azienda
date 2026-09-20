import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRealityDetail } from "@/lib/data/reality-detail";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { tableWrapperClass, thClass, tdClass } from "@/lib/ui";
import {
  REALITY_TYPE_LABEL,
  REALITY_TYPE_ICON,
  STATUS_LABEL,
  type RealityType,
} from "@/lib/reality-types";

export default async function RealityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const data = await getRealityDetail(supabase, id);

  if (!data) notFound();

  const { reality, detail, pnl, reservations, reservationStats, monthlySeries, entries, documents, payments } = data;
  const type = reality.type as RealityType;
  const Icon = REALITY_TYPE_ICON[type];
  const isHospitality = type === "affitto_breve" || type === "hotel";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 shadow-glow">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{reality.name}</h2>
            <p className="text-sm text-neutral-500">{REALITY_TYPE_LABEL[type]}</p>
          </div>
          <Badge tone="info">{STATUS_LABEL[reality.status] ?? reality.status}</Badge>
        </div>

        <Card className="mt-4 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          <InfoItem label="Indirizzo" value={[reality.address, reality.city].filter(Boolean).join(", ") || "—"} />
          <InfoItem label="Proprietà" value={reality.owner || "—"} />
          <InfoItem label="Gestore" value={reality.manager || "—"} />
          <InfoItem label="Data inizio" value={formatDate(reality.start_date)} />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Ricavi" value={formatCurrency(pnl.total_revenue)} tone="revenue" />
        <KpiCard label="Costi" value={formatCurrency(pnl.total_cost)} tone="cost" />
        <KpiCard label="Utile" value={formatCurrency(pnl.profit)} tone="profit" />
        {isHospitality && (
          <>
            <KpiCard label="Prenotazioni" value={String(reservationStats.count)} />
            <KpiCard label="Notti totali" value={String(reservationStats.totalNights)} />
            <KpiCard label="Tariffa media" value={formatCurrency(reservationStats.avgRate)} />
            <KpiCard label="Cash generato" value={formatCurrency(reservationStats.cashGenerated)} tone="revenue" />
          </>
        )}
      </div>

      {monthlySeries.length > 0 && (
        <Section title="Andamento mensile">
          <div className={tableWrapperClass}>
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className={thClass}>Mese</th>
                  <th className={thClass}>Ricavi</th>
                  <th className={thClass}>Costi</th>
                  <th className={thClass}>Utile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {monthlySeries.map((m) => (
                  <tr key={m.month}>
                    <td className={tdClass}>{m.month}</td>
                    <td className={`${tdClass} text-revenue`}>{formatCurrency(m.revenue)}</td>
                    <td className={`${tdClass} text-cost`}>{formatCurrency(m.cost)}</td>
                    <td className={`${tdClass} font-medium text-brand-700`}>{formatCurrency(m.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {isHospitality && (
        <Section title="Prenotazioni">
          {reservations.length === 0 ? (
            <p className="text-sm text-neutral-500">Nessuna prenotazione registrata.</p>
          ) : (
            <div className={tableWrapperClass}>
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className={thClass}>Ospite</th>
                    <th className={thClass}>Piattaforma</th>
                    <th className={thClass}>Check-in</th>
                    <th className={thClass}>Check-out</th>
                    <th className={thClass}>Notti</th>
                    <th className={thClass}>Ricavo netto</th>
                    <th className={thClass}>Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td className={tdClass}>{r.guest_name}</td>
                      <td className={tdClass}>{r.platform ?? "—"}</td>
                      <td className={tdClass}>{formatDate(r.check_in)}</td>
                      <td className={tdClass}>{formatDate(r.check_out)}</td>
                      <td className={tdClass}>{r.nights}</td>
                      <td className={`${tdClass} text-revenue`}>{formatCurrency(r.net_revenue)}</td>
                      <td className={tdClass}>
                        <Badge tone={r.status === "completata" ? "success" : r.status === "cancellata" ? "danger" : "info"}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      <Section title="Movimenti contabili">
        {entries.length === 0 ? (
          <p className="text-sm text-neutral-500">Nessun movimento registrato per questa realtà.</p>
        ) : (
          <div className={tableWrapperClass}>
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className={thClass}>Data</th>
                  <th className={thClass}>Descrizione</th>
                  <th className={thClass}>Tipo</th>
                  <th className={thClass}>Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className={tdClass}>{formatDate(e.entry_date)}</td>
                    <td className={tdClass}>{e.description}</td>
                    <td className={tdClass}>
                      <Badge tone={e.direction === "ricavo" ? "success" : "danger"}>
                        {e.direction}
                      </Badge>
                    </td>
                    <td className={`${tdClass} ${e.direction === "ricavo" ? "text-revenue" : "text-cost"}`}>
                      {formatCurrency(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Pagamenti">
        {payments.length === 0 ? (
          <p className="text-sm text-neutral-500">Nessun pagamento registrato.</p>
        ) : (
          <div className={tableWrapperClass}>
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className={thClass}>Data</th>
                  <th className={thClass}>Direzione</th>
                  <th className={thClass}>Metodo</th>
                  <th className={thClass}>Importo</th>
                  <th className={thClass}>Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className={tdClass}>{formatDate(p.pay_date)}</td>
                    <td className={tdClass}>{p.direction}</td>
                    <td className={tdClass}>{p.method ?? "—"}</td>
                    <td className={tdClass}>{formatCurrency(p.amount)}</td>
                    <td className={tdClass}>
                      <Badge tone={p.status === "completato" ? "success" : "default"}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Documenti">
        {documents.length === 0 ? (
          <p className="text-sm text-neutral-500">Nessun documento caricato.</p>
        ) : (
          <ul className="glass-panel divide-y divide-white/10 rounded-2xl">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-neutral-700">{d.name}</span>
                <span className="text-neutral-400">{d.category ?? "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {detail && (
        <Section title="Dettagli">
          <Card className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
            {Object.entries(detail)
              .filter(([k]) => k !== "reality_id")
              .map(([k, v]) => (
                <InfoItem key={k} label={k.replace(/_/g, " ")} value={v === null || v === "" ? "—" : String(v)} />
              ))}
          </Card>
        </Section>
      )}
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium capitalize text-neutral-800">{value}</p>
    </div>
  );
}
