"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { REALITY_TYPE_PATH, type RealityType } from "@/lib/reality-types";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

function num(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function insertRealityBase(
  companyId: string,
  type: RealityType,
  formData: FormData
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("realities")
    .insert({
      company_id: companyId,
      type,
      name: str(formData, "name"),
      address: str(formData, "address"),
      city: str(formData, "city"),
      postal_code: str(formData, "postal_code"),
      province: str(formData, "province"),
      owner: str(formData, "owner"),
      manager: str(formData, "manager"),
      start_date: str(formData, "start_date"),
      status: str(formData, "status") ?? "attiva",
      notes: str(formData, "notes"),
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Errore nella creazione della realtà");
  }

  return data.id as string;
}

export async function createShortTermRental(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const realityId = await insertRealityBase(company.id, "affitto_breve", formData);

  const { error } = await supabase.from("short_term_rentals").insert({
    reality_id: realityId,
    sqm: num(formData, "sqm"),
    bedrooms: num(formData, "bedrooms"),
    beds: num(formData, "beds"),
    rent_cost: num(formData, "rent_cost") ?? 0,
    mortgage_cost: num(formData, "mortgage_cost") ?? 0,
    utilities_cost: num(formData, "utilities_cost") ?? 0,
    condo_fees: num(formData, "condo_fees") ?? 0,
    cleaning_cost: num(formData, "cleaning_cost") ?? 0,
    platform_fees_pct: num(formData, "platform_fees_pct") ?? 0,
    maintenance_cost: num(formData, "maintenance_cost") ?? 0,
    insurance_cost: num(formData, "insurance_cost") ?? 0,
    tax_cost: num(formData, "tax_cost") ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/immobili/affitti-brevi");
  revalidatePath("/dashboard");
  redirect(`/realta/${realityId}`);
}

export async function createApartment(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const realityId = await insertRealityBase(company.id, "appartamento", formData);

  const { error } = await supabase.from("apartments").insert({
    reality_id: realityId,
    cadastral_data: str(formData, "cadastral_data"),
    sqm: num(formData, "sqm"),
    rooms: num(formData, "rooms"),
    market_value: num(formData, "market_value"),
    rent_income: num(formData, "rent_income") ?? 0,
    mortgage_cost: num(formData, "mortgage_cost") ?? 0,
    condo_fees: num(formData, "condo_fees") ?? 0,
    insurance_cost: num(formData, "insurance_cost") ?? 0,
    tax_cost: num(formData, "tax_cost") ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/immobili/appartamenti");
  revalidatePath("/dashboard");
  redirect(`/realta/${realityId}`);
}

export async function createHotel(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const realityId = await insertRealityBase(company.id, "hotel", formData);

  const { error } = await supabase.from("hotels").insert({
    reality_id: realityId,
    category: str(formData, "category"),
    num_rooms: num(formData, "num_rooms"),
    num_beds: num(formData, "num_beds"),
    opening_date: str(formData, "opening_date"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/immobili/hotel");
  revalidatePath("/dashboard");
  redirect(`/realta/${realityId}`);
}

export function realityListPath(type: RealityType): string {
  return `/immobili/${REALITY_TYPE_PATH[type]}`;
}
