import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { WearItData } from "@/data/home.mock";
import { SectionLabel } from "./section-label";

export function WearIt({ data }: { data: WearItData }) {
  return (
    <section className="bg-[#fbfaf6] px-4 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>{data.eyebrow}</SectionLabel>
            <h2 className="mt-4 text-4xl leading-none sm:text-5xl lg:text-6xl">
              {data.title} <span className="font-serif italic">{data.emphasizedTitle}</span>
            </h2>
          </div>
          <Link
            href={data.socialCta.href}
            className="inline-flex w-fit items-center gap-8 border-b border-neutral-950 pb-2 text-sm"
          >
            {data.socialCta.label} <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-10 flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.items.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="group relative h-[320px] min-w-[230px] overflow-hidden bg-neutral-200 sm:min-w-[280px] lg:min-w-0 lg:flex-1"
            >
              <img
                src={tile.image}
                alt={tile.imageAlt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-white">
                {tile.label} <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
