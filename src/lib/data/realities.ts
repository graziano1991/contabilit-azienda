import type { SupabaseClient } from "@supabase/supabase-js";
import type { RealityType } from "@/lib/reality-types";

export type RealityListItem = {
  id: string;
  name: string;
  type: RealityType;
  city: string | null;
  status: string;
  revenue: number;
  cost: number;
  profit: number;
};

export type CategorySummary = {
  type: RealityType;
  count: number;
  revenue: number;
  cost: number;
  profit: number;
};

export async function getRealitiesByType(
  supabase: SupabaseClient,
  companyId: string,
  type: RealityType
): Promise<RealityListItem[]> {
  const [{ data: realities }, { data: pnl }] = await Promise.all([
    supabase
      .from("realities")
      .select("id, name, type, city, status")
      .eq("company_id", companyId)
      .eq("type", type)
      .order("created_at", { ascending: false }),
    supabase
      .from("v_reality_pnl")
      .select("reality_id, total_revenue, total_cost, profit")
      .eq("company_id", companyId),
  ]);

  const pnlMap = new Map(
    (pnl ?? []).map((p) => [p.reality_id, p])
  );

  return (realities ?? []).map((r) => {
    const p = pnlMap.get(r.id);
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      city: r.city,
      status: r.status,
      revenue: Number(p?.total_revenue ?? 0),
      cost: Number(p?.total_cost ?? 0),
      profit: Number(p?.profit ?? 0),
    };
  });
}

export async function getCategorySummaries(
  supabase: SupabaseClient,
  companyId: string
): Promise<CategorySummary[]> {
  const [{ data: realities }, { data: pnl }] = await Promise.all([
    supabase.from("realities").select("id, type").eq("company_id", companyId),
    supabase
      .from("v_reality_pnl")
      .select("reality_id, total_revenue, total_cost, profit")
      .eq("company_id", companyId),
  ]);

  const pnlMap = new Map((pnl ?? []).map((p) => [p.reality_id, p]));
  const types: RealityType[] = ["affitto_breve", "appartamento", "hotel"];

  return types.map((type) => {
    const items = (realities ?? []).filter((r) => r.type === type);
    const revenue = items.reduce(
      (sum, r) => sum + Number(pnlMap.get(r.id)?.total_revenue ?? 0),
      0
    );
    const cost = items.reduce(
      (sum, r) => sum + Number(pnlMap.get(r.id)?.total_cost ?? 0),
      0
    );
    return {
      type,
      count: items.length,
      revenue,
      cost,
      profit: revenue - cost,
    };
  });
}
