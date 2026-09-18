import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAccountingEntries(
  supabase: SupabaseClient,
  companyId: string,
  realityId?: string
) {
  let query = supabase
    .from("accounting_entries")
    .select("*, realities(name), property_transactions(name), chart_of_accounts(name)")
    .eq("company_id", companyId)
    .order("entry_date", { ascending: false })
    .limit(200);

  if (realityId) query = query.eq("reality_id", realityId);

  const { data } = await query;
  return data ?? [];
}

export async function getVatSummary(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("invoices")
    .select("direction, taxable_amount, vat_amount, issue_date")
    .eq("company_id", companyId);

  const rows = data ?? [];
  const vatOnSales = rows
    .filter((r) => r.direction === "emessa")
    .reduce((sum, r) => sum + Number(r.vat_amount ?? 0), 0);
  const vatOnPurchases = rows
    .filter((r) => r.direction === "ricevuta")
    .reduce((sum, r) => sum + Number(r.vat_amount ?? 0), 0);

  return {
    vatOnSales,
    vatOnPurchases,
    vatBalance: vatOnSales - vatOnPurchases,
    invoiceCount: rows.length,
  };
}
