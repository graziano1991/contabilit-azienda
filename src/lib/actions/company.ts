"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

export async function updateCompany(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const { error } = await supabase
    .from("companies")
    .update({
      name: str(formData, "name") ?? company.name,
      vat_number: str(formData, "vat_number"),
      tax_code: str(formData, "tax_code"),
      address: str(formData, "address"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", company.id);

  if (error) throw new Error(error.message);

  revalidatePath("/impostazioni");
  revalidatePath("/dashboard");
}
