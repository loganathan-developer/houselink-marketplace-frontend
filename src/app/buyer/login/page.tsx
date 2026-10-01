import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { BuyerLoginForm } from "@/features/buyer/auth/buyer-login-form";
import { routes } from "@/lib/routes";

export default function BuyerLoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href={routes.home}
            className="text-2xl font-black sm:text-3xl"
          >
            {"FORM\u00C9"}
            <sup className="ml-1 align-super text-[10px]">&reg;</sup>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase md:flex">
            <Link href={routes.buyer.categories}>Men</Link>
            <Link href={routes.buyer.categories}>Women</Link>
            <Link href={routes.buyer.categories}>Kids</Link>
            <Link href={routes.buyer.categories}>New Arrivals</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href={routes.buyer.login}
              aria-label="Wishlist"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden sm:block">Wishlist</span>
            </Link>

            <Link
              href={routes.buyer.bag}
              aria-label="Bag"
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:block">Bag</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[400px] bg-white shadow-sm">
          <div className="relative h-40 overflow-hidden bg-[#d83b86]">
            <img
              src="/images/forme-login-banner.png"
              alt="FORME fashion collection featuring contemporary Indian and western looks"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-y-0 right-0 flex w-[42%] flex-col justify-center px-4 text-white">
              <p className="text-xl font-semibold leading-tight">
                Curated style.
              </p>

              <p className="mt-1 text-xl font-semibold leading-tight">
                Made for every day.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-9">
            <BuyerLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
