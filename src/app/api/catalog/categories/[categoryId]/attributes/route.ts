import { proxyCategoryRequest } from "@/lib/category-proxy";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  return proxyCategoryRequest(`/${encodeURIComponent(categoryId)}/attributes`);
}
