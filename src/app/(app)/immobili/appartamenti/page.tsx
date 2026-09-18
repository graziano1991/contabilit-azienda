import { createClient } from "@/lib/supabase/server";
import { getCurrentCompany } from "@/lib/data/company";
import { getRealitiesByType } from "@/lib/data/realities";
import { RealityCategoryView } from "@/components/reality-category-view";

export default async function AppartamentiPage() {
  const supabase = await createClient();
  const company = await getCurrentCompany(supabase);
  if (!company) return null;

  const items = await getRealitiesByType(supabase, company.id, "appartamento");

  return (
    <RealityCategoryView
      type="appartamento"
      description="Immobili residenziali o a reddito non destinati ad affitto breve — ognuno è una realtà indipendente."
      newHref="/immobili/nuovo/appartamento"
      items={items}
    />
  );
}
