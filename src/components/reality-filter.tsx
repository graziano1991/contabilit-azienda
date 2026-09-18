"use client";

import { selectClass } from "@/lib/ui";

export function RealityFilter({
  action,
  realities,
  selected,
}: {
  action: string;
  realities: { id: string; name: string }[];
  selected?: string;
}) {
  return (
    <form action={action} method="GET" className="mb-4 flex items-center gap-2">
      <label className="text-sm text-neutral-500" htmlFor="reality-filter">
        Realtà
      </label>
      <select
        id="reality-filter"
        name="reality"
        defaultValue={selected ?? ""}
        className={`${selectClass} max-w-xs`}
        onChange={(e) => e.currentTarget.form?.submit()}
      >
        <option value="">Tutte</option>
        {realities.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </form>
  );
}
