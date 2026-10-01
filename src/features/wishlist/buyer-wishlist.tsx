"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LoaderCircle } from "lucide-react";
import { buyerLoginHref } from "@/features/buyer/auth/buyer-access";
import { useWishlist } from "./use-wishlist";
import { WishlistButton } from "./wishlist-button";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function BuyerWishlist() {
  const router = useRouter();
  const { wishlist, loading, error, loginRequired, retry } = useWishlist();
  const [notice, setNotice] = useState("");
  useEffect(() => { if (loginRequired) router.replace(buyerLoginHref("/buyer/wishlist")); }, [loginRequired, router]);
  return <main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10">
    <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-5"><h1 className="text-3xl font-semibold">Your Wishlist</h1>{wishlist ? <p className="text-sm text-neutral-500">{wishlist.count} saved</p> : null}</div>
    {notice ? <p role="status" className="mt-4 text-sm text-neutral-500">{notice}</p> : null}
    {loading ? <div className="grid min-h-64 place-items-center"><LoaderCircle aria-label="Loading wishlist" className="h-6 w-6 animate-spin" /></div> : null}
    {error ? <div role="alert" className="mt-6 text-sm text-red-600"><p>{error}</p><button onClick={retry} className="mt-3 underline">Try again</button></div> : null}
    {!loading && wishlist && !wishlist.items.length ? <div className="grid min-h-64 content-center justify-items-center gap-4"><Heart className="h-8 w-8 text-neutral-400" /><h2 className="text-xl font-medium">Your wishlist is empty</h2><Link href="/buyer/categories?collection=new-arrivals" className="bg-neutral-950 px-6 py-3 text-sm text-white">Browse New Arrivals</Link></div> : null}
    {!loading && wishlist ? <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{wishlist.items.map(({ product, available }) => <article key={product.id}>
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100"><Link href={`/buyer/products/${encodeURIComponent(product.slug)}`} className="block h-full">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-sm text-neutral-500">Image unavailable</span>}</Link><WishlistButton productId={product.id} name={product.name} slug={product.slug} onFeedback={setNotice} className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white" /></div>
      <p className="mt-3 text-xs font-semibold uppercase text-neutral-500">{product.brand}</p><h2 className="mt-1 text-sm font-semibold"><Link href={`/buyer/products/${encodeURIComponent(product.slug)}`}>{product.name}</Link></h2><p className="mt-2 text-sm font-semibold">{money.format(product.salePrice ?? product.basePrice)}{product.salePrice !== null ? <span className="ml-2 text-xs font-normal text-neutral-400 line-through">{money.format(product.basePrice)}</span> : null}</p>{!available ? <p className="mt-2 text-xs text-red-600">No longer available</p> : null}
    </article>)}</div> : null}
  </main>;
}
