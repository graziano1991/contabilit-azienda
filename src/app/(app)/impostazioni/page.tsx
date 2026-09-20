import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { updateCompany } from "@/lib/actions/company";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TextField, FormSection } from "@/components/ui/form-field";

import { SubmitButton } from "@/components/ui/submit-button";

export default async function ImpostazioniPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const { data: fullCompany } = await supabase
    .from("companies")
    .select("*")
    .eq("id", company.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Impostazioni" description="Dati anagrafici dell'azienda." />

      <Card className="p-6">
        <form action={updateCompany} className="space-y-6">
          <FormSection title="Azienda">
            <TextField label="Nome azienda" name="name" required defaultValue={fullCompany?.name ?? ""} />
            <TextField label="Partita IVA" name="vat_number" defaultValue={fullCompany?.vat_number ?? ""} />
            <TextField label="Codice fiscale" name="tax_code" defaultValue={fullCompany?.tax_code ?? ""} />
            <TextField label="Indirizzo" name="address" defaultValue={fullCompany?.address ?? ""} />
          </FormSection>

          <div className="flex justify-end">
            <SubmitButton>Salva modifiche</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
