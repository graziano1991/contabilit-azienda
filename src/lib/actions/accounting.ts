"use server";

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

async function requireCompany() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");
  return { supabase, company };
}

export async function createAccountingEntry(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("accounting_entries").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    transaction_id: str(formData, "transaction_id"),
    account_id: str(formData, "account_id"),
    entry_date: str(formData, "entry_date") ?? new Date().toISOString().slice(0, 10),
    description: str(formData, "description") ?? "",
    direction: str(formData, "direction") ?? "costo",
    amount: num(formData, "amount"),
    payment_method: str(formData, "payment_method"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/contabilita/prima-nota");
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

export async function createAccount(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("chart_of_accounts").insert({
    company_id: company.id,
    code: str(formData, "code"),
    name: str(formData, "name") ?? "",
    account_type: str(formData, "account_type") ?? "costo",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/piano-dei-conti");
}

export async function createCustomer(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("customers").insert({
    company_id: company.id,
    name: str(formData, "name") ?? "",
    vat_number: str(formData, "vat_number"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    address: str(formData, "address"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/clienti");
}

export async function createSupplier(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("suppliers").insert({
    company_id: company.id,
    name: str(formData, "name") ?? "",
    vat_number: str(formData, "vat_number"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    address: str(formData, "address"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/fornitori");
}

export async function createInvoice(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("invoices").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    transaction_id: str(formData, "transaction_id"),
    direction: str(formData, "direction") ?? "emessa",
    number: str(formData, "number"),
    customer_id: str(formData, "customer_id"),
    supplier_id: str(formData, "supplier_id"),
    issue_date: str(formData, "issue_date") ?? new Date().toISOString().slice(0, 10),
    due_date: str(formData, "due_date"),
    taxable_amount: num(formData, "taxable_amount"),
    vat_rate: num(formData, "vat_rate") || 22,
    status: str(formData, "status") ?? "da_incassare",
    category: str(formData, "category"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/fatture");
  revalidatePath("/contabilita/iva");
}

export async function createPayment(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("payments").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    transaction_id: str(formData, "transaction_id"),
    invoice_id: str(formData, "invoice_id"),
    direction: str(formData, "direction") ?? "incasso",
    amount: num(formData, "amount"),
    pay_date: str(formData, "pay_date") ?? new Date().toISOString().slice(0, 10),
    method: str(formData, "method"),
    bank_account_id: str(formData, "bank_account_id"),
    status: str(formData, "status") ?? "completato",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/pagamenti");
  revalidatePath("/dashboard");
}

export async function createBankAccount(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("bank_accounts").insert({
    company_id: company.id,
    name: str(formData, "name") ?? "",
    iban: str(formData, "iban"),
    bank_name: str(formData, "bank_name"),
    opening_balance: num(formData, "opening_balance"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/banche");
  revalidatePath("/dashboard");
}

export async function createCashTransaction(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("cash_transactions").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    tx_date: str(formData, "tx_date") ?? new Date().toISOString().slice(0, 10),
    description: str(formData, "description"),
    direction: str(formData, "direction") ?? "uscita",
    amount: num(formData, "amount"),
    category: str(formData, "category"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/cassa");
  revalidatePath("/dashboard");
}

export async function createDueDate(formData: FormData) {
  const { supabase, company } = await requireCompany();

  const { error } = await supabase.from("due_dates").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    description: str(formData, "description") ?? "",
    due_date: str(formData, "due_date") ?? new Date().toISOString().slice(0, 10),
    amount: num(formData, "amount"),
    type: str(formData, "type") ?? "da_pagare",
    status: str(formData, "status") ?? "aperta",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contabilita/scadenze");
  revalidatePath("/dashboard");
}
