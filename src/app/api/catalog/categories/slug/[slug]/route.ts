import { proxyCategoryRequest } from "@/lib/category-proxy";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return proxyCategoryRequest(`/slug/${encodeURIComponent(slug)}`);
}
