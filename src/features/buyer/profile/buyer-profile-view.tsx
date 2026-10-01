"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut, MapPin, UserRound } from "lucide-react";
import { getAuthErrorMessage } from "@/features/buyer/auth/auth-api";
import { routes } from "@/lib/routes";
import { buyerLoginHref } from "../auth/buyer-access";
import { getBuyerProfile, logoutBuyer, type BuyerProfile } from "./profile-api";
import { ProfileEditor } from "./profile-editor";
import { AddressManager } from "./address-manager";

export function BuyerProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "addresses">("profile");

  useEffect(() => {
    if (!profile || isLoading) return;
    let frame = 0;
    const syncSection = () => {
      const section = window.location.hash === "#addresses" ? "addresses" : "profile";
      setActiveSection(section);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    };
    syncSection();
    window.addEventListener("hashchange", syncSection);
    window.addEventListener("popstate", syncSection);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", syncSection); window.removeEventListener("popstate", syncSection); };
  }, [profile, isLoading]);

  const navigateSection = (section: "profile" | "addresses") => {
    setActiveSection(section);
    const hash = section === "addresses" ? "#addresses" : "";
    if (window.location.hash !== hash) window.history.pushState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    let isActive = true;

    getBuyerProfile()
      .then((buyer) => {
        if (isActive) setProfile(buyer);
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;

        if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
          router.replace(buyerLoginHref(routes.buyer.profile));
          return;
        }

        setError(getAuthErrorMessage(requestError));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logoutBuyer();
      router.replace(routes.home);
      router.refresh();
    } catch (logoutError) {
      setError(getAuthErrorMessage(logoutError));
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f6f6f4]">
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <LoaderCircle className="h-5 w-5 animate-spin" /> Loading your account
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f6f6f4] px-5 text-center">
        <div>
          <p className="text-sm text-red-600">{error || "Unable to load your account."}</p>
          <Link href={routes.buyer.login} className="mt-5 inline-flex h-11 items-center bg-neutral-950 px-6 text-sm font-semibold text-white">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f6f6f4] px-4 py-5 sm:px-8 sm:py-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid border border-neutral-200 bg-white lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-neutral-200 p-6 lg:border-b-0 lg:border-r">
            <div className="lg:sticky lg:top-24">
            <p className="text-xs uppercase text-neutral-500">My account</p>
            <nav className="mt-6 grid gap-2 text-sm">
              <a href="#profile" onClick={(event) => { event.preventDefault(); navigateSection("profile"); }} aria-current={activeSection === "profile" ? "location" : undefined} className={`flex items-center gap-3 px-4 py-3 ${activeSection === "profile" ? "bg-neutral-950 font-semibold text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"}`}>
                <UserRound className="h-4 w-4" /> Profile
              </a>
              <a href="#addresses" onClick={(event) => { event.preventDefault(); navigateSection("addresses"); }} aria-current={activeSection === "addresses" ? "location" : undefined} className={`flex items-center gap-3 px-4 py-3 ${activeSection === "addresses" ? "bg-neutral-950 font-semibold text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"}`}>
                <MapPin className="h-4 w-4" /> Addresses
              </a>
            </nav>
            </div>
          </aside>

          <section className="p-6 sm:p-10">
            <div id="profile" hidden={activeSection !== "profile"}><ProfileEditor initialProfile={profile} /></div>
            <div hidden={activeSection !== "addresses"}><AddressManager standalone /></div>

            {error ? <p role="alert" className="mb-5 text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-10 inline-flex h-11 items-center justify-center gap-2 border border-neutral-950 px-5 text-sm font-semibold transition hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {isLoggingOut ? "Logging out" : "Logout"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
