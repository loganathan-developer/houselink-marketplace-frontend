"use client";

import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { getCurrentBuyer, getAuthErrorMessage } from "./auth-api";
export { safeBuyerReturnTo, buyerLoginHref } from "@/lib/routes";
import { buyerLoginHref } from "@/lib/routes";

export const BUYER_AUTH_CHANGED = "buyer-auth-changed";

export async function checkBuyerAccess() {
  try {
    const buyer = await getCurrentBuyer();
    return buyer.roles.includes("BUYER");
  } catch (error) {
    if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) return false;
    throw error;
  }
}

export function BuyerAccess({ children, destination }: { children: ReactNode; destination: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    checkBuyerAccess().then((allowed) => {
      if (!active) return;
      if (allowed) setReady(true);
      else router.replace(buyerLoginHref(destination));
    }).catch((reason) => { if (active) setError(getAuthErrorMessage(reason)); });
    return () => { active = false; };
  }, [router, destination, attempt]);
  if (ready) return children;
  return <main className="grid min-h-[60vh] place-items-center px-5">{error ? <div role="alert" className="text-center text-sm"><p>{error}</p><button onClick={() => { setError(""); setAttempt((value) => value + 1); }} className="mt-4 underline">Try again</button></div> : <LoaderCircle aria-label="Loading your account" className="h-6 w-6 animate-spin" />}</main>;
}
