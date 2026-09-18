import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRealityOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("realities")
    .select("id, name, type")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}

export async function getTransactionOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("property_transactions")
    .select("id, name")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}

export async function getAccountOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("chart_of_accounts")
    .select("id, code, name, account_type")
    .eq("company_id", companyId)
    .order("code");
  return data ?? [];
}

export async function getCustomerOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}

export async function getSupplierOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}

export async function getBankAccountOptions(supabase: SupabaseClient, companyId: string) {
  const { data } = await supabase
    .from("bank_accounts")
    .select("id, name")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}
