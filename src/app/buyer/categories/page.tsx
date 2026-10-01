import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { ProductCollectionPage } from "@/features/products/product-collection-page";

export default async function BuyerCategoriesPage({ searchParams }: { searchParams: Promise<{ collection?: string; department?: string }> }) {
  const { collection, department } = await searchParams;
  return <div className="min-h-screen bg-white text-neutral-950"><SiteHeader data={homeMockData.header} /><ProductCollectionPage collection={collection} department={department} /></div>;
}
