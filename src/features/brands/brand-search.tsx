import { Search } from "lucide-react";

export function BrandSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="flex h-11 w-full max-w-md items-center gap-3 border border-neutral-300 bg-white px-4 focus-within:border-neutral-950"><Search className="h-4 w-4 text-neutral-500" /><span className="sr-only">Search brands</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search brands" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>;
}
