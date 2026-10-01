"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryAttribute } from "./category-api";

type FilterState = Record<string, string | string[] | boolean>;

export function CategoryFilters({ attributes }: { attributes: CategoryAttribute[] }) {
  const [filters, setFilters] = useState<FilterState>({});

  if (!attributes.length) {
    return <p className="py-5 text-sm text-neutral-500">No filters are configured for this category.</p>;
  }

  const setFilter = (code: string, value: FilterState[string]) => setFilters((current) => ({ ...current, [code]: value }));
  const toggleValue = (code: string, value: string) => {
    const selected = Array.isArray(filters[code]) ? filters[code] as string[] : [];
    setFilter(code, selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <div className="divide-y divide-neutral-200 border-t border-neutral-200">
      {attributes.map((attribute) => (
        <details key={attribute.id} className="group py-5" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold uppercase">
            {attribute.name}<ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-4">
            <AttributeFilter attribute={attribute} value={filters[attribute.code]} setFilter={setFilter} toggleValue={toggleValue} />
          </div>
        </details>
      ))}
      <button type="button" onClick={() => setFilters({})} className="mt-5 text-xs font-semibold uppercase text-[#e63c2f] hover:underline">Clear all filters</button>
    </div>
  );
}

export function AttributeFilter({ attribute, value, setFilter, toggleValue }: { attribute: CategoryAttribute; value: FilterState[string] | undefined; setFilter: (code: string, value: FilterState[string]) => void; toggleValue: (code: string, value: string) => void }) {
  if (attribute.type === "SELECT") {
    return (
      <select value={typeof value === "string" ? value : ""} onChange={(event) => setFilter(attribute.code, event.target.value)} className="h-10 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950">
        <option value="">All {attribute.name}</option>
        {attribute.values.map((option) => <option key={option.id} value={option.value}>{option.label}</option>)}
      </select>
    );
  }

  if (attribute.type === "MULTI_SELECT") {
    const selected = Array.isArray(value) ? value : [];
    return <div className="grid gap-2.5">{attribute.values.map((option) => <label key={option.id} className="flex cursor-pointer items-center gap-3 text-sm text-neutral-600"><input type="checkbox" checked={selected.includes(option.value)} onChange={() => toggleValue(attribute.code, option.value)} className="h-4 w-4 accent-neutral-950" />{option.label}</label>)}</div>;
  }

  if (attribute.type === "BOOLEAN") {
    return <label className="flex cursor-pointer items-center gap-3 text-sm text-neutral-600"><input type="checkbox" checked={value === true} onChange={(event) => setFilter(attribute.code, event.target.checked)} className="h-4 w-4 accent-neutral-950" />Yes</label>;
  }

  return <input type={attribute.type === "NUMBER" ? "number" : "text"} value={typeof value === "string" ? value : ""} onChange={(event) => setFilter(attribute.code, event.target.value)} placeholder={`Enter ${attribute.name.toLowerCase()}`} className="h-10 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />;
}
