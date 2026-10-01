import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ExploreData } from "@/data/home.mock";
import { SectionLabel } from "./section-label";

export function Explore({ data }: { data: ExploreData }) {
  return (
    <section className="bg-[#fbfaf6] px-4 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SectionLabel>{data.eyebrow}</SectionLabel>
            <h2 className="mt-4 text-4xl leading-none sm:text-5xl lg:text-6xl">
              {data.title} <span className="font-serif italic">{data.emphasizedTitle}</span>
            </h2>
          </div>
          <div className="hidden gap-5 sm:flex">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-transparent" aria-label="Previous story">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white" aria-label="Next story">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {data.cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative min-h-[380px] overflow-hidden bg-neutral-900 text-white"
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
              <div className="relative flex min-h-[380px] max-w-sm flex-col justify-center p-8 sm:p-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
                  <span className="h-2 w-2 bg-[#ff3b1f]" />
                  {card.eyebrow}
                </p>
                <h3 className="mt-6 whitespace-pre-line font-serif text-4xl italic leading-[0.95] sm:text-5xl">
                  {card.title.replace(" ", "\n")}
                </h3>
                <p className="mt-6 max-w-xs text-lg leading-snug text-white/85">
                  {card.description}
                </p>
                <span className="mt-8 inline-flex h-12 w-fit items-center gap-8 bg-white px-6 text-sm font-semibold text-neutral-950">
                  {card.ctaLabel} <ArrowRight className="h-6 w-6" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
