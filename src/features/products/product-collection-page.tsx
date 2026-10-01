"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { getProducts, type CatalogProduct, type ProductQuery } from "./product-api";
import { WishlistButton } from "@/features/wishlist/wishlist-button";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const departmentNames: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  beauty: "Beauty",
  footwear: "Footwear",
  accessories: "Accessories",
};

export function ProductCollectionPage({ collection, department }: { collection?: string; department?: string }) {
  const departmentName = department ? departmentNames[department] : undefined;
  const title = collection === "sale" ? "Sale" : collection === "new-arrivals" ? "New Arrivals" : departmentName ?? "All Products";

  return (
    <main className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-9 sm:px-8 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{departmentName ? `${departmentName} / ` : ""}FORME collection</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <ProductGrid collection={collection} department={department} emptyLabel={departmentName ? `No products are available in ${departmentName} yet.` : undefined} />
    </main>
  );
}

export function ProductGrid({ collection, department, category, emptyLabel, excludeSlug }: ProductQuery & { emptyLabel?: string; excludeSlug?: string }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setProducts([]);
    getProducts({ collection, department, category }).then((data) => { if (active) setProducts(data.products.filter((product) => product.slug !== excludeSlug)); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load products"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, collection, department, excludeSlug]);

  return (
    <div>
      {loading ? <div className="grid min-h-80 place-items-center"><LoaderCircle className="h-6 w-6 animate-spin" /></div> : null}
      {error ? <p className="mt-10 text-sm text-red-600">{error}</p> : null}
      {!loading && !error ? <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{products.map((product) => (
        <article key={product.id} className="relative">
          <Link href={`/buyer/products/${encodeURIComponent(product.slug)}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-neutral-100"><img src={product.imageUrl ?? ""} alt={product.name} className="h-full w-full object-cover" /></div>
          <p className="mt-3 text-xs font-semibold uppercase text-neutral-500">{product.brand.name}</p>
          <h2 className="mt-1 text-sm font-semibold">{product.name}</h2>
          <p className="mt-1 text-sm"><span className="font-semibold">{money.format(product.salePrice ?? product.basePrice)}</span>{product.salePrice ? <span className="ml-2 text-xs text-neutral-400 line-through">{money.format(product.basePrice)}</span> : null}</p>
          </Link>
          <WishlistButton productId={product.id} name={product.name} slug={product.slug} className="absolute right-2 top-2 h-10 w-10 rounded-full bg-white" />
        </article>
      ))}</div> : null}
      {!loading && !error && !products.length ? <p className="mt-10 text-sm text-neutral-500">{emptyLabel ?? "No products are available in this collection yet."}</p> : null}
    </div>
  );
}
