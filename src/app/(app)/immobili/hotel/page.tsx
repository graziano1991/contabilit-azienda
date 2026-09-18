import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealitiesByType } from "@/lib/data/realities";
import { RealityCategoryView } from "@/components/reality-category-view";

export default async function HotelPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const items = await getRealitiesByType(supabase, company.id, "hotel");

  return (
    <RealityCategoryView
      type="hotel"
      description="Hotel e strutture ricettive — ognuna è una realtà indipendente, gestita in modo distinto da un semplice appartamento."
      newHref="/immobili/nuovo/hotel"
      items={items}
    />
  );
}
