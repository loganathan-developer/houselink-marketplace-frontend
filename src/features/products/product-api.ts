 import type { ApiSuccess } from "@/types/api";

export type CatalogProduct = {
  id: string; name: string; slug: string; description: string | null; imageUrl: string | null;
  basePrice: number; salePrice: number | null; publishedAt: string | null;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  variants: Array<{ id: string; sku: string; size: string | null; color: string | null; price: number | null; inventory: { quantity: number } | null }>;
};

export type ProductDetail = Omit<CatalogProduct, "variants"> & {
  variants: Array<CatalogProduct["variants"][number] & { stock: number }>;
  images: string[]; colors: string[]; sizes: string[]; discount: number; stock: number;
  attributes: Array<{ label: string; value: string }>;
  details: Array<{ label: string; value: string }>;
};

export class ProductApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const response = await fetch(`/api/catalog/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok || !result.success) throw new ProductApiError(result.error?.message ?? "Unable to load product.", response.status);
  return result.data.product;
}

export type ProductQuery = {
  collection?: string;
  department?: string;
  category?: string;
};

export async function getProducts(params: ProductQuery) {
  const query = new URLSearchParams();
  if (params.collection) query.set("collection", params.collection);
  if (params.department) query.set("department", params.department);
  if (params.category) query.set("category", params.category);
  query.set("limit", "40");
  const response = await fetch(`/api/catalog/products?${query}`, { credentials: "same-origin" });
  const result = await response.json() as ApiSuccess<{ products: CatalogProduct[]; pagination: { total: number } }> | { success: false; error?: { message?: string } };
  if (!response.ok || !result.success) throw new Error("error" in result ? result.error?.message : "Unable to load products");
  return result.data;
}
