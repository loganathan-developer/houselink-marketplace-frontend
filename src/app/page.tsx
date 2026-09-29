import Link from "next/link";
import { ArrowRight, BadgeCheck, Blocks, ShieldCheck } from "lucide-react";
import { routes } from "@/lib/routes";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            HouseLink Marketplace
          </p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            Frontend foundation for buyer and admin marketplace modules.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Next.js 16, React, TypeScript, Tailwind CSS, Redux Toolkit, Axios,
            Zod, React Hook Form, and Lucide React are ready for API integration.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "Buyer module",
              text: "OTP login, profile, addresses, categories, and brands.",
              href: routes.buyer.login,
            },
            {
              icon: ShieldCheck,
              title: "Admin module",
              text: "Protected admin flows for marketplace management.",
              href: routes.admin.login,
            },
            {
              icon: Blocks,
              title: "Shared core",
              text: "API client, typed responses, Redux store, and UI base.",
              href: routes.buyer.categories,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <item.icon className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                Open <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
