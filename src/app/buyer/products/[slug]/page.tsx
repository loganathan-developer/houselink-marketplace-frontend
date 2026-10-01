import { SiteHeader } from "@/components/home/site-header";
import { Footer } from "@/components/home/footer";
import { homeMockData } from "@/data/home.mock";
import { ProductDetailPage } from "@/features/products/product-detail-page";

export default async function BuyerProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="min-h-screen bg-white text-neutral-950"><SiteHeader data={homeMockData.header} /><ProductDetailPage key={slug} slug={slug} /><Footer data={homeMockData.footer} /></div>;
}
