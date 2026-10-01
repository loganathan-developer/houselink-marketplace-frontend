import type { HeaderData } from "@/data/home.mock";
import { fetchCategoryTreeServer } from "@/lib/category-proxy";
import { Header } from "./header";

export async function SiteHeader({ data }: { data: HeaderData }) {
  const categoryRoots = await fetchCategoryTreeServer().catch(() => []);
  return <Header data={data} initialCategoryRoots={categoryRoots} />;
}
