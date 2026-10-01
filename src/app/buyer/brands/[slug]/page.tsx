import { Footer } from "@/components/home/footer";
import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { BrandDetail } from "@/features/brands/brand-detail";

export default async function BuyerBrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="min-h-screen bg-white text-neutral-950"><SiteHeader data={homeMockData.header} /><BrandDetail slug={slug} /><Footer data={homeMockData.footer} /></div>;
}
