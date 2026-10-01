import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";

export type CartItem = {
  id: string; variantId: string; quantity: number; sku: string; size: string | null; color: string | null;
  product: { name: string; slug: string; imageUrl: string | null; brand: string };
  basePrice: number; salePrice: number | null; unitPrice: number; lineTotal: number;
  stock: number; available: boolean; warning: string | null;
};
export type Cart = { id: string | null; items: CartItem[]; itemCount: number; subtotal: number; total: number; currency: string; hasWarnings: boolean };
export const CART_UPDATED = "buyer-cart-updated";

export async function getCart() {
  return (await apiClient.get<ApiSuccess<{ cart: Cart }>>("/api/cart")).data.data.cart;
}
async function mutation(method: "post" | "patch" | "delete", path: string, input?: unknown) {
  const result = await apiClient.request<ApiSuccess<{ cart: Cart }>>({ method, url: path, data: input });
  const cart = result.data.data.cart;
  window.dispatchEvent(new CustomEvent(CART_UPDATED, { detail: cart }));
  return cart;
}
export const addToCart = (variantId: string, quantity: number) => mutation("post", "/api/cart/items", { variantId, quantity });
export const updateCartItem = (id: string, quantity: number) => mutation("patch", `/api/cart/items/${id}`, { quantity });
export const removeCartItem = (id: string) => mutation("delete", `/api/cart/items/${id}`);
export const needsLogin = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 401;
export function cartError(error: unknown) {
  if (needsLogin(error)) return "Please sign in to use your shopping bag.";
  return axios.isAxiosError(error) ? error.response?.data?.error?.message ?? "Unable to reach the bag service. Please try again." : "Unable to update your bag. Please try again.";
}
