import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BannerData } from "@/data/home.mock";
import { SectionLabel } from "./section-label";

export function Banner({ data }: { data: BannerData }) {
  return (
    <section className="border-b border-neutral-200 bg-[#fbfaf6]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1440px] items-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:py-12">
        <div className="flex max-w-xl flex-col justify-center">
          <SectionLabel>{data.eyebrow}</SectionLabel>
          <h1 className="mt-7 text-[clamp(3.25rem,6vw,6.5rem)] font-light leading-[0.9] text-neutral-950">
            {data.title}
            <span className="block font-serif italic">{data.emphasizedTitle}</span>
          </h1>
          <p className="mt-7 max-w-sm text-base leading-7 text-neutral-600">
            {data.description}
          </p>
          <Link
            href={data.cta.href}
            className="mt-8 inline-flex h-14 w-full max-w-sm items-center justify-between bg-neutral-950 px-6 text-sm font-medium text-white"
          >
            {data.cta.label}
            <ArrowUpRight className="h-5 w-5" />
          </Link>
          <div className="mt-9 grid max-w-sm grid-cols-[1fr_auto_1fr] gap-5 text-xs leading-5 text-neutral-600">
            <p>
              <span className="block text-neutral-950">{data.collectionCount}</span>
              {data.collectionCaption}
            </p>
            <span className="h-full w-px bg-neutral-300" />
            <p>{data.perspective}</p>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden bg-neutral-200 sm:h-[440px] lg:h-[500px]">
          <img
            src={data.image}
            alt={data.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-6 top-6 text-sm font-medium uppercase tracking-[0.16em] text-white sm:left-8 sm:top-8">
            {data.imageLabel}
          </div>
          <div className="absolute right-6 top-6 hidden text-sm font-medium uppercase tracking-[0.24em] text-white [writing-mode:vertical-rl] sm:block">
            {data.volumeLabel}
          </div>
          <Link
            href={data.feature.href}
            className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-[#fbfaf6]/95 p-5 text-neutral-950 sm:bottom-8 sm:left-8 sm:right-8 sm:p-7"
          >
            <span>
              <span className="block text-sm uppercase text-neutral-600">
                {data.feature.eyebrow}
              </span>
              <span className="mt-1 block text-base sm:text-lg">
                {data.feature.label}
              </span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-300">
              <ArrowUpRight className="h-6 w-6" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
