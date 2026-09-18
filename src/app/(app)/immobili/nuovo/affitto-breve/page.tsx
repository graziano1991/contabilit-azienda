import { createShortTermRental } from "@/lib/actions/realities";
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
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";
import Link from "next/link";

export default function NuovoAffittoBrevePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nuovo affitto breve"
        description="Crea una nuova realtà indipendente per un appartamento gestito a affitto breve."
      />

      <Card className="p-6">
        <form action={createShortTermRental} className="space-y-6">
          <FormSection title="Dati immobile">
            <TextField label="Nome" name="name" required placeholder="Es. Appartamento Milano Centro" />
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
            <NumberField label="Metratura" name="sqm" suffix="mq" />
            <NumberField label="Numero camere" name="bedrooms" step="1" />
            <NumberField label="Posti letto" name="beds" step="1" />
            <TextField label="Proprietario" name="owner" />
            <TextField label="Gestore" name="manager" />
            <DateField label="Data inizio gestione" name="start_date" />
          </FormSection>

          <FormSection title="Costi ricorrenti (mensili, indicativi)">
            <NumberField label="Canone affitto" name="rent_cost" suffix="€" />
            <NumberField label="Mutuo" name="mortgage_cost" suffix="€" />
            <NumberField label="Utenze" name="utilities_cost" suffix="€" />
            <NumberField label="Condominio" name="condo_fees" suffix="€" />
            <NumberField label="Pulizie" name="cleaning_cost" suffix="€" />
            <NumberField label="Commissioni piattaforme" name="platform_fees_pct" suffix="%" />
            <NumberField label="Manutenzione" name="maintenance_cost" suffix="€" />
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
            <button type="submit" className={primaryButtonClass}>
              Crea realtà
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
