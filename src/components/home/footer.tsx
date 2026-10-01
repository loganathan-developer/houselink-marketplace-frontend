import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { FooterData } from "@/data/home.mock";

export function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-neutral-950 px-4 py-12 text-white sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.7fr_0.7fr_0.7fr_1.5fr]">
          <div>
            <Link href={data.homeHref} className="text-4xl font-black">
              {data.brand}
              <sup className="ml-1 align-super text-xs font-bold tracking-normal">®</sup>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/75">
              {data.description}
            </p>
            <div className="mt-8 flex gap-3">
              {data.socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xs font-bold text-white"
                  aria-label={`${social.label} social profile`}
                >
                  {social.shortLabel}
                </Link>
              ))}
            </div>
            <p className="mt-12 flex items-center gap-6 text-sm uppercase tracking-[0.3em] text-white/60">
              <span className="h-px w-14 bg-white/45" />
              {data.tagline}
            </p>
          </div>

          {data.sections.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
                {group.title}
              </h3>
              <span className="mt-5 block h-px w-10 bg-white/60" />
              <div className="mt-7 grid gap-4 text-base text-white/75">
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
              {data.newsletter.title}
            </h3>
            <span className="mt-5 block h-px w-10 bg-white/60" />
            <p className="mt-7 max-w-md text-base leading-8 text-white/75">
              {data.newsletter.description}
            </p>
            <form className="mt-8 flex max-w-md border border-white/20">
              <input
                type="email"
                placeholder={data.newsletter.placeholder}
                className="min-w-0 flex-1 bg-transparent px-6 py-5 text-white outline-none placeholder:text-white/55"
              />
              <button className="grid w-20 place-items-center bg-white text-neutral-950" aria-label="Subscribe">
                <ArrowRight className="h-7 w-7" />
              </button>
            </form>
            <label className="mt-6 flex items-center gap-4 text-sm text-white/75">
              <input type="checkbox" className="h-5 w-5 accent-white" />
              {data.newsletter.consentLabel}
            </label>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-10 text-sm text-white/55 lg:flex lg:items-center lg:justify-between">
          <p>{data.copyright}</p>
          <div className="mt-6 flex gap-8 lg:mt-0">
            {data.legalLinks.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </div>
          <button className="mt-6 inline-flex items-center gap-3 lg:mt-0">
            {data.localeLabel} <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
