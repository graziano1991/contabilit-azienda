import Link from "next/link";
import { createTransaction } from "@/lib/actions/transactions";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { TextField, NumberField, DateField, FormSection } from "@/components/ui/form-field";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export default function NuovaCompravenditaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nuova compravendita"
        description="Crea una nuova operazione di acquisto/ristrutturazione/vendita, indipendente dagli immobili a reddito."
      />

      <Card className="p-6">
        <form action={createTransaction} className="space-y-6">
          <FormSection title="Dati operazione">
            <TextField label="Nome operazione" name="name" required placeholder="Es. Milano Via Roma" />
            <TextField label="Tipo immobile" name="property_type" placeholder="Es. Appartamento, Casa, Palazzina" />
            <TextField label="Indirizzo" name="address" />
          </FormSection>

          <FormSection title="Acquisto">
            <NumberField label="Prezzo acquisto" name="purchase_price" suffix="€" />
          </FormSection>

          <FormSection title="Finanziamento">
            <NumberField label="Capitale proprio" name="own_capital" suffix="€" />
            <NumberField label="Finanziamento bancario" name="bank_financing" suffix="€" />
            <NumberField label="Finanziamento soci" name="partner_financing" suffix="€" />
            <NumberField label="Seller financing" name="seller_financing" suffix="€" />
          </FormSection>

          <FormSection title="Previsione vendita">
            <NumberField label="Prezzo vendita previsto" name="expected_sale_price" suffix="€" />
            <DateField label="Data prevista vendita" name="expected_sale_date" />
          </FormSection>

          <div className="flex justify-end gap-3">
            <Link href="/compravendite" className={secondaryButtonClass}>
              Annulla
            </Link>
            <button type="submit" className={primaryButtonClass}>
              Crea operazione
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
