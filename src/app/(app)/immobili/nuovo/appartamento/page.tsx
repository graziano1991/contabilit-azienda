import { createApartment } from "@/lib/actions/realities";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import {
  TextField,
  NumberField,
  DateField,
  SelectField,
  TextAreaField,
  FormSection,
} from "@/components/ui/form-field";
import { secondaryButtonClass } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";

export default function NuovoAppartamentoPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nuovo appartamento"
        description="Crea una nuova realtà indipendente per un immobile residenziale o a reddito."
      />

      <Card className="p-6">
        <form action={createApartment} className="space-y-6">
          <FormSection title="Dati immobile">
            <TextField label="Nome" name="name" required placeholder="Es. Appartamento Como" />
            <SelectField
              label="Stato"
              name="status"
              defaultValue="attiva"
              options={[
                { value: "attiva", label: "Attiva" },
                { value: "inattiva", label: "Inattiva" },
                { value: "in_ristrutturazione", label: "In ristrutturazione" },
                { value: "chiusa", label: "Chiusa" },
              ]}
            />
            <TextField label="Indirizzo" name="address" />
            <TextField label="Città" name="city" />
            <TextField label="CAP" name="postal_code" />
            <TextField label="Provincia" name="province" />
            <TextField label="Dati catastali" name="cadastral_data" placeholder="Foglio, particella, sub..." />
            <NumberField label="Metratura" name="sqm" suffix="mq" />
            <NumberField label="Numero vani" name="rooms" step="1" />
            <NumberField label="Valore di mercato" name="market_value" suffix="€" />
            <TextField label="Proprietario" name="owner" />
            <TextField label="Gestore" name="manager" />
            <DateField label="Data inizio gestione" name="start_date" />
          </FormSection>

          <FormSection title="Dati economici (mensili, indicativi)">
            <NumberField label="Canone incassato" name="rent_income" suffix="€" />
            <NumberField label="Mutuo" name="mortgage_cost" suffix="€" />
            <NumberField label="Condominio" name="condo_fees" suffix="€" />
            <NumberField label="Assicurazione" name="insurance_cost" suffix="€" />
            <NumberField label="Tasse" name="tax_cost" suffix="€" />
          </FormSection>

          <FormSection title="Note">
            <TextAreaField label="Note" name="notes" />
          </FormSection>

          <div className="flex justify-end gap-3">
            <Link href="/immobili/nuovo" className={secondaryButtonClass}>
              Annulla
            </Link>
            <SubmitButton>Crea realtà</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
