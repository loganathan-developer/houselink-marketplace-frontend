"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/features/products/product-collection-page";
import { CategoryFilters } from "./category-filters";
import { categoryHref, getCategoryAttributes, getCategoryBySlug, getCategoryErrorMessage, type CategoryAttribute, type CategoryDetail } from "./category-api";

export function CategoryPageView({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError("");
    setCategory(null);
    setAttributes([]);

    getCategoryBySlug(slug)
      .then(async (selected) => {
        const configuredAttributes = await getCategoryAttributes(selected.id);
        if (isActive) {
          setCategory(selected);
          setAttributes(configuredAttributes);
        }
      })
      .catch((requestError) => { if (isActive) setError(getCategoryErrorMessage(requestError)); })
      .finally(() => { if (isActive) setIsLoading(false); });

    return () => { isActive = false; };
  }, [slug]);

  if (isLoading) return <div className="grid min-h-[60vh] place-items-center"><span className="flex items-center gap-3 text-sm text-neutral-500"><LoaderCircle className="h-5 w-5 animate-spin" />Loading category</span></div>;
  if (!category) return <div className="grid min-h-[60vh] place-items-center px-5 text-center text-sm text-red-600">{error || "Category not found."}</div>;

  return (
    <main className="min-h-screen bg-white px-4 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/">Home</Link><ChevronRight className="h-3 w-3" />
          {category.breadcrumbs.map((item, index) => <span key={item.id} className="flex items-center gap-1.5"><Link href={categoryHref(item.slug)} className={index === category.breadcrumbs.length - 1 ? "font-semibold text-neutral-950" : "hover:text-neutral-950"}>{item.name}</Link>{index < category.breadcrumbs.length - 1 ? <ChevronRight className="h-3 w-3" /> : null}</span>)}
        </nav>

        <div className="mt-5 border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-semibold">{category.name}</h1>
          {category.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{category.description}</p> : null}
        </div>

        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-neutral-200 py-6 lg:border-b-0 lg:border-r lg:pr-7">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase"><SlidersHorizontal className="h-4 w-4" /> Filters</h2>
            <div className="mt-5"><CategoryFilters key={category.id} attributes={attributes} /></div>
          </aside>
          <section className="min-h-[480px] py-6 lg:pl-8" aria-label={`${category.name} products`}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <p className="text-sm font-semibold">{category.name}</p>
              <select aria-label="Sort products" className="h-10 border border-neutral-300 bg-white px-3 text-sm"><option>Recommended</option><option>Newest</option><option>Price: Low to High</option><option>Price: High to Low</option></select>
            </div>
            <ProductGrid key={category.slug} category={category.slug} emptyLabel={`No products are available in ${category.name} yet.`} />
          </section>
        </div>
      </div>
    </main>
  );
}
