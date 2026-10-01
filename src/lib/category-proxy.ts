import "server-only";
import type { CategoryNode } from "@/features/categories/category-api";

const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function fetchCategoryTreeServer(): Promise<CategoryNode[]> {
  const response = await fetch(`${backendUrl}/api/categories/tree`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Category tree request failed with ${response.status}`);
  const result = await response.json() as { success: true; data: { categories: CategoryNode[] } };
  return result.data.categories;
}

export async function proxyCategoryRequest(path: string) {
  try {
    const upstream = await fetch(`${backendUrl}/api/categories${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { success: false, error: { code: "CATALOG_UNAVAILABLE", message: "Catalog service is unavailable." } },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
