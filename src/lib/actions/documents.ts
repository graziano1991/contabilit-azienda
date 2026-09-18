"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

export async function createDocument(formData: FormData) {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) throw new Error("Azienda non trovata");

  const { error } = await supabase.from("documents").insert({
    company_id: company.id,
    reality_id: str(formData, "reality_id"),
    transaction_id: str(formData, "transaction_id"),
    name: str(formData, "name") ?? "",
    file_path: str(formData, "file_path") ?? "",
    category: str(formData, "category"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/documenti");
}
