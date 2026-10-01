"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buyerLoginHref } from "@/features/buyer/auth/buyer-access";
import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { cartError, getCart, needsLogin, removeCartItem, updateCartItem, type Cart } from "./cart-api";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export function BuyerBag() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [login, setLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const load = () => {
      setLoading(true); setError("");
      getCart().then((value) => { if (active) { setCart(value); setLogin(false); } })
        .catch((reason) => { if (active) { setError(cartError(reason)); setLogin(needsLogin(reason)); setCart(null); if (needsLogin(reason)) router.replace(buyerLoginHref("/buyer/bag")); } })
        .finally(() => { if (active) setLoading(false); });
    };
    load();
    return () => { active = false; };
  }, [attempt, router]);
  async function change(action: () => Promise<Cart>) {
    if (busy) return;
    setBusy(true); setError("");
    try { setCart(await action()); }
    catch (reason) {
      setError(cartError(reason)); setLogin(needsLogin(reason));
      if (needsLogin(reason)) { setCart(null); router.replace(buyerLoginHref("/buyer/bag")); return; }
      try { setCart(await getCart()); } catch { /* Keep the mutation error visible. */ }
    } finally { setBusy(false); }
  }

  return <main className="mx-auto min-h-[65vh] max-w-[1280px] px-4 py-8 sm:px-8">
    <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3 border-b border-neutral-200 pb-5"><h1 className="text-3xl font-semibold">Your Bag</h1>{cart ? <p className="text-sm text-neutral-500">{cart.itemCount} items</p> : null}</div>
    {loading ? <div aria-label="Loading bag" className="grid min-h-64 place-items-center"><LoaderCircle className="h-6 w-6 animate-spin" /></div> : null}
    {error ? <div role="alert" className="mb-6 text-sm text-red-600"><p>{error}</p>{login ? <Link href="/buyer/login" className="mt-2 inline-block underline">Sign in</Link> : <button onClick={() => setAttempt((value) => value + 1)} className="mt-2 underline">Try again</button>}</div> : null}
    {!loading && cart && cart.items.length === 0 ? <div className="grid min-h-64 justify-items-center content-center gap-4"><ShoppingBag className="h-9 w-9 text-neutral-400" /><h2 className="text-xl font-medium">Your bag is empty</h2><Link href="/buyer/categories" className="bg-neutral-950 px-6 py-3 text-sm text-white">Browse products</Link></div> : null}
    {!loading && cart && cart.items.length > 0 ? <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <section aria-label="Bag items" className="divide-y divide-neutral-200">{cart.items.map((item) => <article key={item.id} className="flex gap-4 py-5 first:pt-0 sm:gap-6">
        <Link href={`/buyer/products/${item.product.slug}`} className="w-24 shrink-0 sm:w-32"><div className="aspect-[3/4] bg-neutral-100">{item.product.imageUrl ? <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" /> : null}</div></Link>
        <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase text-neutral-500">{item.product.brand}</p><h2 className="mt-1 text-sm font-semibold sm:text-base"><Link href={`/buyer/products/${item.product.slug}`}>{item.product.name}</Link></h2><p className="mt-2 text-xs text-neutral-500">{item.size ?? "One size"} / {item.color ?? "Default colour"}</p>
          <p className="mt-3 text-sm font-semibold">{money.format(item.unitPrice)}{item.unitPrice < item.basePrice ? <span className="ml-2 text-xs font-normal text-neutral-400 line-through">{money.format(item.basePrice)}</span> : null}</p>
          {item.warning ? <p role="status" className="mt-2 text-xs text-red-600">{item.warning}</p> : <p className="mt-2 text-xs text-[#137a70]">In stock</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4"><div className="flex items-center border border-neutral-300"><button aria-label={`Decrease quantity of ${item.product.name}`} disabled={busy || !item.available || item.stock === 0 || item.quantity <= 1} onClick={() => change(() => updateCartItem(item.id, Math.min(item.quantity - 1, item.stock)))} className="grid h-9 w-9 place-items-center disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button><output className="w-8 text-center text-sm">{item.quantity}</output><button aria-label={`Increase quantity of ${item.product.name}`} disabled={busy || !item.available || item.quantity >= item.stock} onClick={() => change(() => updateCartItem(item.id, item.quantity + 1))} className="grid h-9 w-9 place-items-center disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button></div><button title="Remove item" aria-label={`Remove ${item.product.name}`} disabled={busy} onClick={() => change(() => removeCartItem(item.id))} className="grid h-9 w-9 place-items-center text-neutral-500 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button></div>
        </div><p className="hidden text-sm font-semibold sm:block">{money.format(item.lineTotal)}</p>
      </article>)}</section>
      <aside className="border-t border-neutral-200 pt-5 lg:sticky lg:top-24"><h2 className="text-lg font-semibold">Bag Summary</h2><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt>Items</dt><dd>{cart.itemCount}</dd></div><div className="flex justify-between"><dt>Subtotal</dt><dd>{money.format(cart.subtotal)}</dd></div><div className="flex justify-between border-t border-neutral-200 pt-4 font-semibold"><dt>Total amount</dt><dd>{money.format(cart.total)}</dd></div></dl>{cart.hasWarnings ? <p className="mt-4 text-xs text-red-600">Review unavailable items and stock warnings.</p> : null}<button disabled className="mt-6 h-12 w-full bg-neutral-200 text-sm text-neutral-500">Checkout</button><p className="mt-2 text-xs text-neutral-500">Checkout is not available yet.</p><Link href="/buyer/categories" className="mt-5 inline-block text-sm underline">Continue shopping</Link></aside>
    </div> : null}
  </main>;
}
