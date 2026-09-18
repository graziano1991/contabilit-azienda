import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTransactions(supabase: SupabaseClient, companyId: string) {
  const [{ data: transactions }, { data: pnl }] = await Promise.all([
    supabase
      .from("property_transactions")
      .select("id, name, status, address, purchase_price, sale_price")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    supabase.from("v_transaction_pnl").select("*").eq("company_id", companyId),
  ]);

  const pnlMap = new Map((pnl ?? []).map((p) => [p.transaction_id, p]));

  return (transactions ?? []).map((t) => ({
    ...t,
    investment: Number(pnlMap.get(t.id)?.total_investment ?? 0),
    saleRevenue: Number(pnlMap.get(t.id)?.total_sale_revenue ?? 0),
    profit: Number(pnlMap.get(t.id)?.gross_profit ?? 0),
  }));
}

export async function getTransactionsSummary(supabase: SupabaseClient, companyId: string) {
  const list = await getTransactions(supabase, companyId);
  const active = list.filter((t) => !["venduto", "chiusa"].includes(t.status));
  const closed = list.filter((t) => ["venduto", "chiusa"].includes(t.status));
  const totalInvested = list.reduce((sum, t) => sum + t.investment, 0);
  const totalSaleRevenue = closed.reduce((sum, t) => sum + t.saleRevenue, 0);
  const totalProfit = closed.reduce((sum, t) => sum + t.profit, 0);
  const roiValues = closed
    .filter((t) => t.investment > 0)
    .map((t) => (t.profit / t.investment) * 100);
  const avgRoi = roiValues.length
    ? roiValues.reduce((s, v) => s + v, 0) / roiValues.length
    : 0;

  return {
    list,
    activeCount: active.length,
    closedCount: closed.length,
    totalInvested,
    totalSaleRevenue,
    totalCost: totalInvested,
    totalProfit,
    avgRoi,
  };
}

export async function getTransactionDetail(supabase: SupabaseClient, id: string) {
  const [{ data: transaction }, { data: pnl }, { data: costs }, { data: revenues }] =
    await Promise.all([
      supabase.from("property_transactions").select("*").eq("id", id).maybeSingle(),
      supabase.from("v_transaction_pnl").select("*").eq("transaction_id", id).maybeSingle(),
      supabase
        .from("property_transaction_costs")
        .select("*")
        .eq("transaction_id", id)
        .order("cost_date", { ascending: false }),
      supabase
        .from("property_transaction_revenues")
        .select("*")
        .eq("transaction_id", id)
        .order("revenue_date", { ascending: false }),
    ]);

  if (!transaction) return null;

  const investment = Number(pnl?.total_investment ?? 0);
  const profit = Number(pnl?.gross_profit ?? 0);
  const roi = investment > 0 ? (profit / investment) * 100 : 0;
  const totalFinancing =
    Number(transaction.own_capital ?? 0) +
    Number(transaction.bank_financing ?? 0) +
    Number(transaction.partner_financing ?? 0) +
    Number(transaction.seller_financing ?? 0) +
    Number(transaction.other_financing ?? 0);
  const debt =
    Number(transaction.bank_financing ?? 0) +
    Number(transaction.partner_financing ?? 0) +
    Number(transaction.seller_financing ?? 0) +
    Number(transaction.other_financing ?? 0);

  return {
    transaction,
    investment,
    saleRevenue: Number(pnl?.total_sale_revenue ?? 0),
    profit,
    roi,
    marginPct: Number(pnl?.total_sale_revenue ?? 0) > 0 ? (profit / Number(pnl?.total_sale_revenue)) * 100 : 0,
    totalFinancing,
    debt,
    costs: costs ?? [],
    revenues: revenues ?? [],
  };
}
