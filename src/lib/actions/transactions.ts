"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

function num(formData: FormData, key: string): number {
  const value = str(formData, key);
  if (value === null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const { data, error } = await supabase
    .from("property_transactions")
    .insert({
      company_id: company.id,
      name: str(formData, "name"),
      address: str(formData, "address"),
      property_type: str(formData, "property_type"),
      status: "analisi",
      purchase_price: num(formData, "purchase_price"),
      own_capital: num(formData, "own_capital"),
      bank_financing: num(formData, "bank_financing"),
      partner_financing: num(formData, "partner_financing"),
      seller_financing: num(formData, "seller_financing"),
      expected_sale_price: num(formData, "expected_sale_price"),
      expected_sale_date: str(formData, "expected_sale_date"),
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Errore nella creazione dell'operazione");

  revalidatePath("/compravendite");
  revalidatePath("/dashboard");
  redirect(`/compravendite/${data.id}`);
}

export async function updateTransaction(formData: FormData) {
  const id = str(formData, "id");
  if (!id) throw new Error("ID mancante");

  const supabase = await createClient();

  const { error } = await supabase
    .from("property_transactions")
    .update({
      status: str(formData, "status"),
      purchase_price: num(formData, "purchase_price"),
      purchase_date: str(formData, "purchase_date"),
      purchase_notary_cost: num(formData, "purchase_notary_cost"),
      purchase_taxes: num(formData, "purchase_taxes"),
      purchase_agency_cost: num(formData, "purchase_agency_cost"),
      purchase_financial_cost: num(formData, "purchase_financial_cost"),
      purchase_other_cost: num(formData, "purchase_other_cost"),
      sale_price: num(formData, "sale_price") || null,
      sale_date: str(formData, "sale_date"),
      sale_notary_cost: num(formData, "sale_notary_cost"),
      sale_taxes: num(formData, "sale_taxes"),
      sale_agency_cost: num(formData, "sale_agency_cost"),
      sale_other_cost: num(formData, "sale_other_cost"),
      own_capital: num(formData, "own_capital"),
      bank_financing: num(formData, "bank_financing"),
      partner_financing: num(formData, "partner_financing"),
      seller_financing: num(formData, "seller_financing"),
      other_financing: num(formData, "other_financing"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/compravendite/${id}`);
  revalidatePath("/compravendite");
  revalidatePath("/dashboard");
  redirect(`/compravendite/${id}`);
}

export async function addTransactionCost(formData: FormData) {
  const transactionId = str(formData, "transaction_id");
  if (!transactionId) throw new Error("ID mancante");

  const supabase = await createClient();
  const { error } = await supabase.from("property_transaction_costs").insert({
    transaction_id: transactionId,
    phase: str(formData, "phase") ?? "ristrutturazione",
    category: str(formData, "category") ?? "altro",
    description: str(formData, "description"),
    amount: num(formData, "amount"),
    cost_date: str(formData, "cost_date") ?? new Date().toISOString().slice(0, 10),
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/compravendite/${transactionId}`);
  revalidatePath("/compravendite");
  revalidatePath("/dashboard");
  redirect(`/compravendite/${transactionId}`);
}
