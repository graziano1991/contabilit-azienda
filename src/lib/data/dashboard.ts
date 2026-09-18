import type { SupabaseClient } from "@supabase/supabase-js";

export type RealitySummary = {
  reality_id: string;
  type: "affitto_breve" | "appartamento" | "hotel" | string;
  name: string;
  total_revenue: number;
  total_cost: number;
  profit: number;
};

export type TransactionSummary = {
  transaction_id: string;
  name: string;
  status: string;
  total_investment: number;
  total_sale_revenue: number;
  gross_profit: number;
};

export type DashboardData = {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  cash: number;
  receivables: number;
  payables: number;
  realities: RealitySummary[];
  transactions: TransactionSummary[];
};

export async function getDashboardData(
  supabase: SupabaseClient,
  companyId: string
): Promise<DashboardData> {
  const [
    companyPnlRes,
    realitiesRes,
    transactionsRes,
    bankAccountsRes,
    bankTxRes,
    cashTxRes,
    dueDatesRes,
  ] = await Promise.all([
    supabase.from("v_company_pnl").select("*").eq("company_id", companyId).maybeSingle(),
    supabase.from("v_reality_pnl").select("*").eq("company_id", companyId),
    supabase.from("v_transaction_pnl").select("*").eq("company_id", companyId),
    supabase.from("bank_accounts").select("opening_balance").eq("company_id", companyId),
    supabase.from("bank_transactions").select("amount, direction").eq("company_id", companyId),
    supabase.from("cash_transactions").select("amount, direction").eq("company_id", companyId),
    supabase
      .from("due_dates")
      .select("amount, type")
      .eq("company_id", companyId)
      .eq("status", "aperta"),
  ]);

  const bankOpening = (bankAccountsRes.data ?? []).reduce(
    (sum, a) => sum + Number(a.opening_balance ?? 0),
    0
  );
  const bankFlow = (bankTxRes.data ?? []).reduce(
    (sum, t) =>
      sum + (t.direction === "entrata" ? Number(t.amount) : -Number(t.amount)),
    0
  );
  const cashFlow = (cashTxRes.data ?? []).reduce(
    (sum, t) =>
      sum + (t.direction === "entrata" ? Number(t.amount) : -Number(t.amount)),
    0
  );

  const receivables = (dueDatesRes.data ?? [])
    .filter((d) => d.type === "da_incassare")
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const payables = (dueDatesRes.data ?? [])
    .filter((d) => d.type === "da_pagare")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return {
    totalRevenue: Number(companyPnlRes.data?.total_revenue ?? 0),
    totalCost: Number(companyPnlRes.data?.total_cost ?? 0),
    totalProfit: Number(companyPnlRes.data?.total_profit ?? 0),
    cash: bankOpening + bankFlow + cashFlow,
    receivables,
    payables,
    realities: (realitiesRes.data ?? []) as RealitySummary[],
    transactions: (transactionsRes.data ?? []) as TransactionSummary[],
  };
}
