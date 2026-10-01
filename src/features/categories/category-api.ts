import type { ApiSuccess } from "@/types/api";

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  children: CategoryNode[];
};

export type CategoryBreadcrumb = Pick<CategoryNode, "id" | "name" | "slug">;

export type CategoryDetail = Omit<CategoryNode, "children"> & {
  breadcrumbs: CategoryBreadcrumb[];
};

export type AttributeType = "SELECT" | "MULTI_SELECT" | "TEXT" | "NUMBER" | "BOOLEAN";

export type CategoryAttributeValue = {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
};

export type CategoryAttribute = {
  id: string;
  name: string;
  code: string;
  type: AttributeType;
  isRequired: boolean;
  isFilterable: boolean;
  isVariantOption: boolean;
  sortOrder: number;
  values: CategoryAttributeValue[];
};

export const categoryHref = (slug: string) => `/buyer/categories/${encodeURIComponent(slug)}`;

async function catalogRequest<T>(path: string) {
  const response = await fetch(`/api/catalog/categories${path}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  const result = await response.json() as ApiSuccess<T> | { success: false; error?: { message?: string } };
  if (!response.ok || !result.success) {
    const message = "error" in result ? result.error?.message : undefined;
    throw new Error(message ?? "Unable to load category information.");
  }
  return result.data;
}

export async function getCategoryTree() {
  return (await catalogRequest<{ categories: CategoryNode[] }>("/tree")).categories;
}

export async function getCategoryBySlug(slug: string) {
  return (await catalogRequest<{ category: CategoryDetail }>(`/slug/${encodeURIComponent(slug)}`)).category;
}

export async function getCategoryAttributes(categoryId: string) {
  return (await catalogRequest<{ categoryId: string; attributes: CategoryAttribute[] }>(`/${categoryId}/attributes`)).attributes
    .filter((attribute) => attribute.isFilterable)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((attribute) => ({ ...attribute, values: [...attribute.values].sort((left, right) => left.sortOrder - right.sortOrder) }));
}

export function getCategoryErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to load category information.";
}
