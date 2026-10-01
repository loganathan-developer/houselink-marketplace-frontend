import type { ApiResponse } from "@/types/api";

export type Brand = { id: string; name: string; slug: string; description: string | null; logoUrl: string | null };
export type BrandPagination = { page: number; limit: number; total: number; totalPages: number };

async function request<T>(path: string) {
  const response = await fetch(`/api/catalog/brands${path}`, { credentials: "same-origin", headers: { Accept: "application/json" } });
  const result = await response.json() as ApiResponse<T>;
  if ("error" in result) throw new Error(result.error.message);
  if (!response.ok) throw new Error("Unable to load brands.");
  return result.data;
}

export function getBrands({ page, limit, q }: { page: number; limit: number; q?: string }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q) query.set("q", q);
  return request<{ brands: Brand[]; pagination: BrandPagination }>(`?${query}`);
}

export function getBrandBySlug(slug: string) {
  return request<{ brand: Brand }>(`/slug/${encodeURIComponent(slug)}`).then((data) => data.brand);
}
