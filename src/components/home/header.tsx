"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import type { HeaderAction, HeaderData } from "@/data/home.mock";
import { buyerDisplayName, getCurrentBuyer, getAuthErrorMessage, type BuyerUser } from "@/features/buyer/auth/auth-api";
import { logoutBuyer } from "@/features/buyer/profile/profile-api";
import { BUYER_AUTH_CHANGED, buyerLoginHref } from "@/features/buyer/auth/buyer-access";
import { getCategoryTree, type CategoryNode } from "@/features/categories/category-api";
import { DesktopMegaMenu, MobileCategoryMenu } from "@/features/categories/mega-menu";
import { routes } from "@/lib/routes";
import { CART_UPDATED, getCart, type Cart } from "@/features/cart/cart-api";

const actionIcons: Record<HeaderAction["id"], typeof Search> = {
  search: Search,
  profile: UserRound,
  wishlist: Heart,
  bag: ShoppingBag,
};

export function Header({ data, initialCategoryRoots = [] }: { data: HeaderData; initialCategoryRoots?: CategoryNode[] }) {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [buyer, setBuyer] = useState<BuyerUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isAuthenticated = Boolean(buyer);
  const [categoryRoots, setCategoryRoots] = useState<CategoryNode[]>(initialCategoryRoots);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountActionsRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    setLoggingOut(true); setAuthError("");
    try {
      await logoutBuyer(); setBuyer(null); setBagCount(0); setProfileOpen(false);
      router.replace(routes.home); router.refresh();
    } catch (error) { setAuthError(getAuthErrorMessage(error)); }
    finally { setLoggingOut(false); }
  }

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!accountActionsRef.current?.contains(event.target as Node)) {
        setProfileOpen(false); setSearchOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setProfileOpen(false); setSearchOpen(false); }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const load = async () => {
      const current = ++revision;
      try { const cart = await getCart(); if (active && current === revision) setBagCount(cart.itemCount); }
      catch { if (active && current === revision) setBagCount(0); }
    };
    const update = (event: Event) => { revision++; setBagCount((event as CustomEvent<Cart>).detail.itemCount); };
    const focus = () => { void load(); };
    void load();
    window.addEventListener(CART_UPDATED, update);
    window.addEventListener("focus", focus);
    return () => { active = false; window.removeEventListener(CART_UPDATED, update); window.removeEventListener("focus", focus); };
  }, []);

  useEffect(() => {
    let isActive = true;
    let revision = 0;
    const load = async () => {
      const current = ++revision;
      try {
        const user = await getCurrentBuyer();
        if (isActive && current === revision) setBuyer(user.roles.includes("BUYER") ? user : null);
      } catch { if (isActive && current === revision) { setBuyer(null); setBagCount(0); } }
      finally { if (isActive && current === revision) setAuthLoading(false); }
    };
    const changed = () => { setAuthLoading(true); void load(); };
    void load();
    window.addEventListener(BUYER_AUTH_CHANGED, changed);
    window.addEventListener("focus", changed);
    return () => {
      isActive = false;
      window.removeEventListener(BUYER_AUTH_CHANGED, changed);
      window.removeEventListener("focus", changed);
    };
  }, []);

  useEffect(() => {
    if (initialCategoryRoots.length) return;
    let isActive = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const loadCategories = () => {
      getCategoryTree()
        .then((categories) => { if (isActive) setCategoryRoots(categories); })
        .catch(() => {
          attempts += 1;
          if (isActive && attempts < 4) retryTimer = setTimeout(loadCategories, attempts * 1000);
        });
    };

    loadCategories();
    return () => {
      isActive = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [initialCategoryRoots]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-[#fbfaf6]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-8 lg:px-10">
        <Link href={data.homeHref} className="text-2xl font-black text-neutral-950 sm:text-3xl">
          {data.brand}
          <sup className="ml-1 align-super text-xs font-bold tracking-normal">®</sup>
        </Link>

        <DesktopMegaMenu navItems={data.navItems} roots={categoryRoots} />

        <div ref={accountActionsRef} className="flex items-center gap-2 text-neutral-950 sm:gap-4">
          {data.actions.map((action) => {
            const Icon = actionIcons[action.id];
            if (action.id === "search") {
              return (
                <div key={action.id} className="relative">
                <button type="button" onClick={() => { setSearchOpen((open) => !open); setProfileOpen(false); }} aria-label={action.label} aria-expanded={searchOpen} aria-controls="header-search-card" className="flex min-w-8 flex-col items-center justify-center gap-0.5 text-[10px] font-bold sm:min-w-10">
                  <Icon className="h-5 w-5" />
                  <span className="hidden xl:block">{action.label}</span>
                </button>
                {searchOpen ? <div id="header-search-card" role="status" className="absolute right-0 top-full z-50 mt-3 w-56 border border-neutral-200 bg-white p-5 text-sm font-normal shadow-lg">Search is not available yet.</div> : null}
                </div>
              );
            }
            const protectedDestination = action.id === "bag" ? routes.buyer.bag : "/buyer/wishlist";
            const actionHref =
              action.id === "profile"
                ? (isAuthenticated ? routes.buyer.profile : routes.buyer.login)
                : (isAuthenticated ? protectedDestination : buyerLoginHref(protectedDestination));

            if (action.id === "profile") {
              return (
                <div key={action.id} className="relative" onMouseEnter={() => { setProfileOpen(true); setSearchOpen(false); }} onMouseLeave={() => setProfileOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setProfileOpen(false); }}>
                  <button
                    type="button"
                    onClick={() => { setProfileOpen(true); setSearchOpen(false); }}
                    onFocus={() => { setProfileOpen(true); setSearchOpen(false); }}
                    aria-expanded={profileOpen}
                    aria-controls="header-profile-card"
                    aria-label={action.label}
                    className="flex min-w-8 flex-col items-center justify-center gap-0.5 text-[10px] font-bold sm:min-w-10"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden xl:block">{action.label}</span>
                  </button>

                  <div id="header-profile-card" className={`${profileOpen ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"} absolute right-1/2 top-full z-50 w-64 translate-x-1/2 pt-3 transition`}>
                    <div className="border border-neutral-200 bg-white p-5 text-left shadow-lg">
                      {authLoading ? <p role="status" className="text-sm text-neutral-500">Loading your account...</p> : buyer ? <>
                        <p className="text-sm font-semibold">Hello {buyerDisplayName(buyer)}</p>
                        {buyer.email ? <p className="mt-1 break-words text-xs text-neutral-500">{buyer.email}</p> : null}
                        <div className="mt-3 divide-y divide-neutral-200 text-sm">
                          <div className="grid gap-2 py-3">
                            <button disabled className="text-left text-neutral-400">Orders</button>
                            <Link href="/buyer/wishlist" onClick={() => setProfileOpen(false)} className="hover:underline">Wishlist</Link>
                            {["Gift Cards", "Contact Us"].map((label) => <button key={label} disabled className="text-left text-neutral-400">{label}</button>)}
                          </div>
                          <div className="grid gap-2 py-3">{["FORME Insider", "FORME Credit", "Coupons"].map((label) => <button key={label} disabled className="text-left text-neutral-400">{label}</button>)}</div>
                          <div className="grid gap-2 py-3">{["Saved Cards", "Saved VPA"].map((label) => <button key={label} disabled className="text-left text-neutral-400">{label}</button>)}</div>
                          <div className="grid gap-2 pt-3">
                            <Link href={routes.buyer.profile} onClick={() => setProfileOpen(false)} className="hover:underline">Edit Profile</Link>
                            <button disabled={loggingOut} onClick={handleLogout} className="text-left hover:underline disabled:opacity-50">{loggingOut ? "Logging out..." : "Logout"}</button>
                          </div>
                        </div>
                        {authError ? <p role="alert" className="mt-3 text-xs text-red-600">{authError}</p> : null}
                      </> : <>
                      <p className="text-sm font-semibold text-neutral-950">Welcome to FORME</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                       Login or sign up to manage your account and orders.
                      </p>
                      <Link
                        href={isAuthenticated ? routes.buyer.profile : routes.buyer.login}
                        className="mt-4 flex h-10 items-center justify-center bg-neutral-950 px-4 text-xs font-semibold uppercase text-white hover:bg-neutral-800"
                      >
                        Login / Sign Up
                      </Link>
                      </>}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={action.id}
                href={actionHref}
                aria-label={action.id === "bag" ? `Bag, ${bagCount} items` : action.label}
                className="flex min-w-8 flex-col items-center justify-center gap-0.5 text-[10px] font-bold sm:min-w-10"
              >
                <span className="relative"><Icon className="h-5 w-5" />{action.id === "bag" && bagCount > 0 ? <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-neutral-950 px-1 text-center text-[9px] leading-4 text-white">{bagCount}</span> : null}</span>
                <span className="hidden xl:block">{action.label}</span>
              </Link>
            );
          })}
          <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden" aria-label="Open navigation menu">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
      <MobileCategoryMenu open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navItems={data.navItems} roots={categoryRoots} />
    </header>
  );
}
