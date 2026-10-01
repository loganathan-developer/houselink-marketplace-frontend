import { Footer } from "@/components/home/footer";
import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { BrandGrid } from "@/features/brands/brand-grid";

export default function BuyerBrandsPage() {
  return <div className="min-h-screen bg-white text-neutral-950"><SiteHeader data={homeMockData.header} /><main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-9 sm:px-8 lg:px-10"><BrandGrid /></main><Footer data={homeMockData.footer} /></div>;
}
