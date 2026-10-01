"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { NewArrivalsData } from "@/data/home.mock";
import { SectionLabel } from "./section-label";
import { getProducts, type CatalogProduct } from "@/features/products/product-api";

export function NewArrivals({ data }: { data: NewArrivalsData }) {
  const [notice, setNotice] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState(data.filters[0]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setProducts([]);
    const department = activeFilter === "Men" ? "men" : activeFilter === "Women" ? "women" : undefined;
    getProducts({ collection: "new-arrivals", department })
      .then((result) => { if (active) setProducts(result.products); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load arrivals."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [activeFilter]);

  const scrollProducts = (direction: -1 | 1) => {
    sliderRef.current?.scrollBy({
      left: direction * Math.min(sliderRef.current.clientWidth, 720),
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#fbfaf6] px-4 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel>{data.eyebrow}</SectionLabel>
            <h2 className="mt-4 text-4xl leading-none text-neutral-950 sm:text-5xl lg:text-6xl">
              {data.title} <span className="font-serif italic">{data.emphasizedTitle}</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {data.filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`h-11 border px-6 text-sm ${
                    activeFilter === filter
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-transparent text-neutral-950"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-8 lg:flex-col lg:items-end">
            <Link
              href="/buyer/categories?collection=new-arrivals"
              className="inline-flex items-center gap-10 border-b border-neutral-950 pb-2 text-sm"
            >
              {data.cta.label} <ArrowUpRight className="h-5 w-5" />
            </Link>
            <div className="hidden gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scrollProducts(-1)}
                className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100"
                aria-label="Previous arrivals"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollProducts(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200"
                aria-label="Next arrivals"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? <p role="status" className="mt-8 text-sm text-neutral-500">Loading arrivals...</p> : null}
        {error ? <p role="alert" className="mt-8 text-sm text-red-600">{error}</p> : null}
        {notice ? <p role="status" className="mt-4 text-sm text-neutral-500">{notice}</p> : null}
        {!loading && !error && !products.length ? <p className="mt-8 text-sm text-neutral-500">No new arrivals available.</p> : null}
        <div
          ref={sliderRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <article key={product.id} className="w-[82vw] shrink-0 snap-start overflow-hidden border border-neutral-100 bg-white shadow-sm sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-0.9375rem)]">
              <div className="relative aspect-[0.9/1] overflow-hidden bg-neutral-200">
                <Link href={`/buyer/products/${encodeURIComponent(product.slug)}`} className="block h-full">
                <img
                  src={product.imageUrl ?? undefined}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                </Link>
                <span className="absolute left-4 top-4 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wide">
                  New arrival
                </span>
                <WishlistButton productId={product.id} name={product.name} slug={product.slug} onFeedback={setNotice} className="absolute right-4 top-4 h-12 w-12 rounded-full bg-white" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold"><Link href={`/buyer/products/${encodeURIComponent(product.slug)}`}>{product.name}</Link></h3>
                    <p className="mt-1 text-xs text-neutral-500">{product.brand.name}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.salePrice ?? product.basePrice)}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-3">
                    {[...new Set(product.variants.map((variant) => variant.color).filter(Boolean))].map((color) => (
                      <span
                        key={color}
                        className="text-xs text-neutral-500"
                      >{color}</span>
                    ))}
                  </div>
                  <Link
                    href={`/buyer/products/${encodeURIComponent(product.slug)}`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200"
                    aria-label={`View ${product.name}`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
