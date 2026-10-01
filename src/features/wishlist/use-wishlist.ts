"use client";

import { useEffect, useState } from "react";
import { getAuthErrorMessage } from "@/features/buyer/auth/auth-api";
import { BUYER_AUTH_CHANGED } from "@/features/buyer/auth/buyer-access";
import { needsLogin } from "@/features/cart/cart-api";
import { getWishlist, WISHLIST_UPDATED, type Wishlist } from "./wishlist-api";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const load = () => {
      const current = ++revision;
      setLoading(true); setError("");
      getWishlist().then((value) => {
        if (active && current === revision) { setWishlist(value); setLoginRequired(false); }
      }).catch((reason) => {
        if (active && current === revision) { setWishlist(null); setLoginRequired(needsLogin(reason)); setError(needsLogin(reason) ? "" : getAuthErrorMessage(reason)); }
      }).finally(() => { if (active && current === revision) setLoading(false); });
    };
    const update = (event: Event) => {
      revision++; setWishlist((event as CustomEvent<Wishlist>).detail); setLoading(false); setError(""); setLoginRequired(false);
    };
    const authChanged = () => { revision++; setWishlist(null); load(); };
    load();
    window.addEventListener(WISHLIST_UPDATED, update);
    window.addEventListener(BUYER_AUTH_CHANGED, authChanged);
    window.addEventListener("focus", load);
    return () => { active = false; window.removeEventListener(WISHLIST_UPDATED, update); window.removeEventListener(BUYER_AUTH_CHANGED, authChanged); window.removeEventListener("focus", load); };
  }, [attempt]);
  return { wishlist, loading, error, loginRequired, retry: () => setAttempt((value) => value + 1) };
}
