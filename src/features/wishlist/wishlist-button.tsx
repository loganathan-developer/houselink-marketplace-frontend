"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LoaderCircle } from "lucide-react";
import { buyerLoginHref, checkBuyerAccess } from "@/features/buyer/auth/buyer-access";
import { getAuthErrorMessage } from "@/features/buyer/auth/auth-api";
import { needsLogin } from "@/features/cart/cart-api";
import { setWishlistProduct } from "./wishlist-api";
import { useWishlist } from "./use-wishlist";

export function WishlistButton({ productId, name, slug, className = "", onFeedback }: { productId: string; name: string; slug: string; className?: string; onFeedback?: (message: string) => void }) {
  const router = useRouter();
  const { wishlist, loading } = useWishlist();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saved = Boolean(wishlist?.items.some((item) => item.productId === productId));
  const loginHref = buyerLoginHref(`/buyer/products/${encodeURIComponent(slug)}`);
  async function toggle() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      if (!await checkBuyerAccess()) { router.push(loginHref); return; }
      await setWishlistProduct(productId, !saved);
      onFeedback?.(saved ? "Removed from wishlist." : "Saved to wishlist.");
    } catch (reason) {
      if (needsLogin(reason)) router.push(loginHref);
      else { const message = getAuthErrorMessage(reason); setError(message); onFeedback?.(message); }
    } finally { setBusy(false); }
  }
  return <span className={className}>
    <button type="button" title={saved ? "Remove from wishlist" : "Add to wishlist"} aria-label={`${saved ? "Remove" : "Add"} ${name} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} disabled={busy || loading} onClick={toggle} className={`grid h-full w-full place-items-center disabled:opacity-60 ${saved ? "text-red-600" : "text-neutral-950"}`}>
      {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />}
    </button>
    {error && !onFeedback ? <span role="alert" className="absolute right-0 top-full z-10 mt-2 w-48 border border-red-200 bg-white p-2 text-xs text-red-600">{error}</span> : null}
  </span>;
}
