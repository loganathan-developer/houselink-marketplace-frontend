"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getBrands, type Brand, type BrandPagination } from "./brand-api";
import { BrandCard } from "./brand-card";
import { BrandSearch } from "./brand-search";

const pageSize = 12;
export function BrandGrid() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<BrandPagination>({ page: 1, limit: pageSize, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { const timer = setTimeout(() => { setDebouncedQuery(query.trim()); setPage(1); }, 350); return () => clearTimeout(timer); }, [query]);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    getBrands({ page, limit: pageSize, q: debouncedQuery || undefined }).then((data) => { if (active) { setBrands(data.brands); setPagination(data.pagination); } }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load brands."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, debouncedQuery]);

  return <section>
    <div className="flex flex-col gap-5 border-b border-neutral-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Discover labels</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Brands</h1></div><BrandSearch value={query} onChange={setQuery} /></div>
    {loading ? <div className="grid min-h-72 place-items-center"><LoaderCircle className="h-6 w-6 animate-spin" /></div> : null}
    {error ? <div className="py-16 text-center text-sm text-red-600">{error}</div> : null}
    {!loading && !error && !brands.length ? <div className="py-16 text-center text-sm text-neutral-500">No brands match your search.</div> : null}
    {!loading && !error && brands.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div> : null}
    {!loading && !error && pagination.totalPages > 1 ? <div className="mt-10 flex items-center justify-center gap-4"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="border border-neutral-300 px-5 py-2 text-sm font-semibold disabled:opacity-40">Previous</button><span className="text-sm text-neutral-500">Page {page} of {pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="border border-neutral-300 px-5 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div> : null}
  </section>;
}
