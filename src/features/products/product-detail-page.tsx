"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buyerLoginHref, checkBuyerAccess } from "@/features/buyer/auth/buyer-access";
import { ChevronRight, LoaderCircle, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { getProductBySlug, ProductApiError, type ProductDetail } from "./product-api";
import { ProductGrid } from "./product-collection-page";
import { addToCart, getCart, cartError, needsLogin } from "@/features/cart/cart-api";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const swatches: Record<string, string> = { black: "#171717", natural: "#ded8cc", white: "#ffffff", blue: "#426b9a", red: "#ad3843", rose: "#c57f88", berry: "#793651", nude: "#bf9281" };

export function ProductDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const loginHref = buyerLoginHref(`/buyer/products/${encodeURIComponent(slug)}`);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [adding, setAdding] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  async function addSelectedToBag() {
    const variant = product?.variants.find((item) => item.id === variantId);
    if (!variant || variant.stock < quantity || quantity < 1 || adding) return;
    setAdding(true); setNotice(""); setLoginRequired(false);
    try {
      if (!await checkBuyerAccess()) { router.push(loginHref); return; }
      const cart = await getCart();
      if (cart.items.some((item) => item.variantId === variant.id)) {
        setNotice("This variant is already in your bag."); return;
      }
      await addToCart(variant.id, quantity);
      setNotice("Added to your bag.");
    } catch (reason) {
      setNotice(cartError(reason)); setLoginRequired(needsLogin(reason));
      if (needsLogin(reason)) router.push(loginHref);
    } finally { setAdding(false); }
  }

  useEffect(() => {
    let active = true;
    setProduct(null); setError(""); setNotFound(false);
    getProductBySlug(slug).then((item) => {
      if (!active) return;
      setProduct(item);
      setVariantId((item.variants.find((variant) => variant.stock > 0) ?? item.variants[0])?.id ?? "");
      setQuantity(1); setImageIndex(0);
    }).catch((reason) => {
      if (!active) return;
      setNotFound(reason instanceof ProductApiError && reason.status === 404);
      setError(reason instanceof Error ? reason.message : "Unable to load product.");
    });
    return () => { active = false; };
  }, [slug, attempt]);

  if (error) return <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-20"><h1 className="text-2xl font-semibold">{notFound ? "Product not found" : "Unable to load this product"}</h1><p className="mt-3 text-sm text-neutral-500">{error}</p>{notFound ? <Link href="/buyer/categories" className="mt-6 inline-block underline">Browse products</Link> : <button onClick={() => setAttempt((value) => value + 1)} className="mt-6 border border-neutral-300 px-5 py-2">Try again</button>}</main>;
  if (!product) return <main aria-label="Loading product" className="grid min-h-[65vh] place-items-center"><LoaderCircle className="h-7 w-7 animate-spin" /></main>;

  const selected = product.variants.find((variant) => variant.id === variantId);
  const price = selected?.price ?? product.salePrice ?? product.basePrice;
  const discount = price < product.basePrice && product.basePrice > 0 ? Math.round((product.basePrice - price) / product.basePrice * 100) : 0;
  const stock = selected?.stock ?? 0;
  const chooseVariant = (id: string) => { setVariantId(id); setQuantity(1); setNotice(""); };

  return <main className="mx-auto max-w-[1440px] px-4 pb-14 pt-5 sm:px-8 lg:px-10">
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs text-neutral-500"><Link href="/">Home</Link><ChevronRight className="h-3 w-3" /><Link href={`/buyer/categories/${product.category.slug}`}>{product.category.name}</Link><ChevronRight className="h-3 w-3" /><span className="text-neutral-900">{product.name}</span></nav>
    <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <section aria-label="Product gallery" className="min-w-0">
        <div className="aspect-[4/5] overflow-hidden bg-neutral-100">{product.images[imageIndex] ? <img src={product.images[imageIndex]} alt={`${product.name}, view ${imageIndex + 1}`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-neutral-500">Image unavailable</div>}</div>
        {product.images.length > 1 ? <div className="mt-3 flex gap-3 overflow-x-auto">{product.images.map((url, index) => <button key={url} onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1}`} aria-pressed={index === imageIndex} className={`h-24 w-20 shrink-0 border-2 ${index === imageIndex ? "border-neutral-950" : "border-transparent"}`}><img src={url} alt="" className="h-full w-full object-cover" /></button>)}</div> : null}
      </section>
      <section className="min-w-0 lg:pt-2">
        <p className="text-xs uppercase text-neutral-500"><Link href={`/buyer/brands/${product.brand.slug}`} className="hover:underline">{product.brand.name}</Link> / {product.category.name}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
        <p className="mt-4 text-xs text-neutral-500">No reviews yet</p>
        <div className="mt-5 flex flex-wrap items-baseline gap-3"><span className="text-2xl font-semibold">{money.format(price)}</span>{discount > 0 ? <><span className="text-sm text-neutral-400 line-through">{money.format(product.basePrice)}</span><span className="text-sm font-semibold text-[#137a70]">{discount}% off</span></> : null}</div>
        {product.description ? <p className="mt-5 text-sm leading-6 text-neutral-600">{product.description}</p> : null}
        {product.colors.length ? <fieldset className="mt-7"><legend className="text-sm font-medium">Colour: {selected?.color ?? "Choose a colour"}</legend><div className="mt-3 flex flex-wrap gap-3">{product.colors.map((color) => {
          const candidates = product.variants.filter((variant) => variant.color === color && variant.stock > 0);
          const next = candidates.find((variant) => variant.size === selected?.size) ?? candidates[0];
          return <button key={color} title={color} aria-label={`Colour ${color}`} aria-pressed={selected?.color === color} disabled={!next} onClick={() => next && chooseVariant(next.id)} className={`flex items-center gap-2 border px-3 py-2 text-xs disabled:opacity-35 ${selected?.color === color ? "border-neutral-950" : "border-neutral-200"}`}><span className="h-4 w-4 rounded-full border border-neutral-300" style={{ background: swatches[color.toLowerCase()] ?? "#b7b7b7" }} />{color}</button>;
        })}</div></fieldset> : null}
        {product.sizes.length ? <fieldset className="mt-6"><legend className="text-sm font-medium">Size</legend><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map((size) => {
          const candidate = product.variants.find((variant) => variant.size === size && variant.color === selected?.color);
          return <button key={size} disabled={!candidate || candidate.stock <= 0} aria-pressed={selected?.size === size} onClick={() => candidate && chooseVariant(candidate.id)} className={`min-w-12 border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:text-neutral-300 disabled:line-through ${selected?.size === size ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300"}`}>{size}</button>;
        })}</div></fieldset> : null}
        <p role="status" className={`mt-4 text-xs ${stock > 0 ? "text-[#137a70]" : "text-red-600"}`}>{stock > 0 ? `${stock} available` : "Out of stock"}{selected ? ` · SKU ${selected.sku}` : ""}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex h-12 items-center border border-neutral-300"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} className="grid h-11 w-10 place-items-center disabled:opacity-30"><Minus className="h-4 w-4" /></button><output aria-label="Quantity" className="w-8 text-center text-sm">{quantity}</output><button aria-label="Increase quantity" disabled={stock <= quantity} onClick={() => setQuantity((value) => value + 1)} className="grid h-11 w-10 place-items-center disabled:opacity-30"><Plus className="h-4 w-4" /></button></div>
          <button disabled={!selected || stock < quantity || stock <= 0 || adding} onClick={addSelectedToBag} className="flex h-12 flex-1 items-center justify-center gap-3 bg-neutral-950 px-5 text-sm text-white disabled:bg-neutral-300">{adding ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}{adding ? "Adding..." : "Add to Bag"}</button>
          <WishlistButton productId={product.id} name={product.name} slug={product.slug} onFeedback={setNotice} className="relative grid h-12 w-12 place-items-center border border-neutral-300" />
        </div>
        {notice ? <p role="status" className="mt-3 text-xs text-neutral-500">{notice}</p> : null}
        {loginRequired ? <Link href="/buyer/login" className="mt-2 inline-block text-sm underline">Sign in to add to bag</Link> : notice === "Added to your bag." || notice === "This variant is already in your bag." ? <Link href="/buyer/bag" className="mt-2 inline-block text-sm underline">View bag</Link> : null}
        <div className="my-7 grid grid-cols-3 gap-3 text-xs leading-5 text-neutral-500"><div className="flex flex-col gap-2"><Truck className="h-5 w-5 text-neutral-900" />Shipping details pending</div><div className="flex flex-col gap-2"><RotateCcw className="h-5 w-5 text-neutral-900" />Returns policy pending</div><div className="flex flex-col gap-2"><ShieldCheck className="h-5 w-5 text-neutral-900" />Authenticity details pending</div></div>
        <div className="border-t border-neutral-200">
          <details open className="border-b border-neutral-200 py-4"><summary className="cursor-pointer text-sm font-medium">Product Details</summary><dl className="mt-4 grid grid-cols-2 gap-4 text-xs">{[...product.details, ...product.attributes].map((detail) => <div key={detail.label}><dt className="text-neutral-500">{detail.label}</dt><dd className="mt-1">{detail.value}</dd></div>)}</dl>{selected ? <p className="mt-4 text-xs text-neutral-500">Selected: {selected.color ?? "Default colour"} / {selected.size ?? "One size"}</p> : null}</details>
          <details className="border-b border-neutral-200 py-4"><summary className="cursor-pointer text-sm font-medium">Fabric &amp; Care</summary><p className="mt-3 text-sm text-neutral-500">Fabric and care information has not been provided for this product.</p></details>
          <details className="border-b border-neutral-200 py-4"><summary className="cursor-pointer text-sm font-medium">Delivery &amp; Returns</summary><p className="mt-3 text-sm text-neutral-500">Delivery estimates and return terms will be available when checkout launches.</p></details>
        </div>
      </section>
    </div>
    <section className="mt-12 border-t border-neutral-200 pt-8"><h2 className="text-2xl font-semibold">You may also like</h2><ProductGrid category={product.category.slug} excludeSlug={product.slug} emptyLabel="No related products available yet." /></section>
  </main>;
}
