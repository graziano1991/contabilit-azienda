import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealitiesByType } from "@/lib/data/realities";
import { RealityCategoryView } from "@/components/reality-category-view";

export default async function AffittiBreviPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const items = await getRealitiesByType(supabase, company.id, "affitto_breve");

  return (
    <RealityCategoryView
      type="affitto_breve"
      description="Appartamenti gestiti a affitto breve (Airbnb, Booking, prenotazioni dirette) — ognuno è una realtà indipendente."
      newHref="/immobili/nuovo/affitto-breve"
      items={items}
    />
  );
}
