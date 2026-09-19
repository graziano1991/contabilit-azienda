"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Vive solo qui, lato server: non finisce mai nel bundle JS inviato al
// browser, non è leggibile da devtools/rete, non è in nessuna variabile
// client-side.
const SECURITY_PASSWORD = "FUTURI MILIONARI";

export async function verifySecurityPassword(
  code: string
): Promise<{ ok: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false };

  if (code.trim().toUpperCase() !== SECURITY_PASSWORD) {
    return { ok: false };
  }

  const { error } = await supabase
    .from("company_users")
    .update({ security_verified: true })
    .eq("user_id", user.id);

  if (error) return { ok: false };

  revalidatePath("/", "layout");
  return { ok: true };
}
