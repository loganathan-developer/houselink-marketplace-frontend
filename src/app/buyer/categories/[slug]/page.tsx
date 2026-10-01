import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { CategoryPageView } from "@/features/categories/category-page-view";

export default async function BuyerCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="min-h-screen text-neutral-950">
      <SiteHeader data={homeMockData.header} />
      <CategoryPageView slug={slug} />
    </div>
  );
}
