import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";

export type WishlistItem = {
  id: string; productId: string; available: boolean;
  product: { id: string; name: string; slug: string; imageUrl: string | null; brand: string; basePrice: number; salePrice: number | null };
};
export type Wishlist = { items: WishlistItem[]; count: number };
export const WISHLIST_UPDATED = "buyer-wishlist-updated";
let pendingRead: Promise<Wishlist> | null = null;

export function getWishlist() {
  if (!pendingRead) {
    pendingRead = apiClient.get<ApiSuccess<{ wishlist: Wishlist }>>("/api/wishlist")
      .then((response) => response.data.data.wishlist).finally(() => { pendingRead = null; });
  }
  return pendingRead;
}

export async function setWishlistProduct(productId: string, saved: boolean) {
  const response = await apiClient.request<ApiSuccess<{ wishlist: Wishlist }>>({
    method: saved ? "post" : "delete", url: saved ? "/api/wishlist/items" : `/api/wishlist/items/${encodeURIComponent(productId)}`,
    ...(saved ? { data: { productId } } : {}),
  });
  const wishlist = response.data.data.wishlist;
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED, { detail: wishlist }));
  return wishlist;
}
