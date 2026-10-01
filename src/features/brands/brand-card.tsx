import Link from "next/link";
import type { Brand } from "./brand-api";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/buyer/brands/${encodeURIComponent(brand.slug)}`} className="group border border-neutral-200 bg-white p-5 transition hover:border-neutral-950">
      <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-neutral-50">
        {brand.logoUrl ? <img src={brand.logoUrl} alt={`${brand.name} logo`} className="max-h-24 max-w-[75%] object-contain" /> : <span className="text-4xl font-black text-neutral-300">{brand.name.slice(0, 1).toUpperCase()}</span>}
      </div>
      <h2 className="mt-4 text-base font-semibold group-hover:underline">{brand.name}</h2>
      {brand.description ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-neutral-500">{brand.description}</p> : null}
    </Link>
  );
}
