import { createHotel } from "@/lib/actions/realities";
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

export default function NuovoHotelPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nuova struttura"
        description="Crea una nuova realtà indipendente per un hotel, residence o struttura ricettiva."
      />

      <Card className="p-6">
        <form action={createHotel} className="space-y-6">
          <FormSection title="Dati struttura">
            <TextField label="Nome" name="name" required placeholder="Es. Hotel Como" />
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
            <TextField label="Categoria" name="category" placeholder="Es. 3 stelle" />
            <NumberField label="Numero camere" name="num_rooms" step="1" />
            <NumberField label="Posti letto" name="num_beds" step="1" />
            <TextField label="Proprietà" name="owner" />
            <TextField label="Gestione" name="manager" />
            <DateField label="Data apertura" name="opening_date" />
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
