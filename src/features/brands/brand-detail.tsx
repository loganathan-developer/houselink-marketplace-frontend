"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { getBrandBySlug, type Brand } from "./brand-api";

export function BrandDetail({ slug }: { slug: string }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); getBrandBySlug(slug).then((value) => { if (active) setBrand(value); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load brand."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [slug]);
  if (loading) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="h-6 w-6 animate-spin" /></div>;
  if (!brand) return <div className="grid min-h-[60vh] place-items-center px-5 text-sm text-red-600">{error || "Brand not found."}</div>;
  return <main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10">
    <nav className="flex items-center gap-2 text-xs text-neutral-500"><Link href="/">Home</Link><ChevronRight className="h-3 w-3" /><Link href="/buyer/brands">Brands</Link><ChevronRight className="h-3 w-3" /><span className="font-semibold text-neutral-950">{brand.name}</span></nav>
    <section className="mt-8 grid gap-8 border-b border-neutral-200 pb-12 md:grid-cols-[280px_1fr] md:items-center">
      <div className="grid aspect-[4/3] place-items-center bg-neutral-50">{brand.logoUrl ? <img src={brand.logoUrl} alt={`${brand.name} logo`} className="max-h-32 max-w-[75%] object-contain" /> : <span className="text-7xl font-black text-neutral-300">{brand.name.slice(0, 1).toUpperCase()}</span>}</div>
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Brand</p><h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{brand.name}</h1>{brand.description ? <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">{brand.description}</p> : null}</div>
    </section>
    <section className="py-12"><h2 className="text-2xl font-semibold">Products from {brand.name}</h2><p className="mt-3 text-sm text-neutral-500">Products from this brand will appear here when brand filtering is available in the product catalog.</p></section>
  </main>;
}
