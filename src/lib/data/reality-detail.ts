import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRealityDetail(supabase: SupabaseClient, id: string) {
  const { data: reality } = await supabase
    .from("realities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!reality) return null;

  const [
    detailRes,
    pnlRes,
    reservationsRes,
    entriesRes,
    documentsRes,
    paymentsRes,
  ] = await Promise.all([
    reality.type === "affitto_breve"
      ? supabase.from("short_term_rentals").select("*").eq("reality_id", id).maybeSingle()
      : reality.type === "appartamento"
      ? supabase.from("apartments").select("*").eq("reality_id", id).maybeSingle()
      : supabase.from("hotels").select("*").eq("reality_id", id).maybeSingle(),
    supabase.from("v_reality_pnl").select("*").eq("reality_id", id).maybeSingle(),
    reality.type === "affitto_breve" || reality.type === "hotel"
      ? supabase
          .from("reservations")
          .select("*")
          .eq("reality_id", id)
          .order("check_in", { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
    supabase
      .from("accounting_entries")
      .select("*")
      .eq("reality_id", id)
      .order("entry_date", { ascending: false })
      .limit(50),
    supabase
      .from("documents")
      .select("*")
      .eq("reality_id", id)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("reality_id", id)
      .order("pay_date", { ascending: false })
      .limit(50),
  ]);

  const entries = entriesRes.data ?? [];
  const monthly = new Map<string, { revenue: number; cost: number }>();
  for (const e of entries) {
    const month = String(e.entry_date).slice(0, 7);
    const bucket = monthly.get(month) ?? { revenue: 0, cost: 0 };
    if (e.direction === "ricavo") bucket.revenue += Number(e.amount);
    else bucket.cost += Number(e.amount);
    monthly.set(month, bucket);
  }
  const monthlySeries = Array.from(monthly.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 12)
    .map(([month, v]) => ({ month, ...v, profit: v.revenue - v.cost }));

  const reservations = reservationsRes.data ?? [];
  const completedOrOngoing = reservations.filter((r) => r.status !== "cancellata");
  const totalNights = completedOrOngoing.reduce((sum, r) => sum + Number(r.nights ?? 0), 0);
  const avgRate =
    completedOrOngoing.length > 0
      ? completedOrOngoing.reduce((sum, r) => sum + Number(r.gross_price ?? 0), 0) /
        completedOrOngoing.length
      : 0;

  return {
    reality,
    detail: detailRes.data,
    pnl: pnlRes.data ?? { total_revenue: 0, total_cost: 0, profit: 0 },
    reservations,
    reservationStats: {
      count: completedOrOngoing.length,
      totalNights,
      avgRate,
      cashGenerated: completedOrOngoing.reduce(
        (sum, r) => sum + Number(r.net_revenue ?? 0),
        0
      ),
    },
    monthlySeries,
    entries,
    documents: documentsRes.data ?? [],
    payments: paymentsRes.data ?? [],
  };
}
