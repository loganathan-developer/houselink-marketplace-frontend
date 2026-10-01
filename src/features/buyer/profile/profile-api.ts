import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import { BUYER_AUTH_CHANGED } from "../auth/buyer-access";
import { getCurrentBuyer } from "../auth/auth-api";

export type BuyerProfile = {
  id: string;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BuyerAddress = {
  id: string;
  userId: string;
  recipientName: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = Pick<
  BuyerAddress,
  "recipientName" | "contactPhone" | "addressLine1" | "addressLine2" | "city" | "state" | "postalCode" | "country" | "isDefault"
>;

export async function getBuyerProfile() {
  const [response, buyer] = await Promise.all([
    apiClient.get<ApiSuccess<{ user: BuyerProfile }>>("/api/users/me"),
    getCurrentBuyer(),
  ]);
  return { ...response.data.data.user, phone: buyer.phone };
}

export async function updateBuyerProfile(input: { name: string | null; email: string | null; profileImage: string | null }) {
  const response = await apiClient.patch<ApiSuccess<{ user: BuyerProfile }>>("/api/users/me", input);
  window.dispatchEvent(new Event(BUYER_AUTH_CHANGED));
  return response.data.data.user;
}

export async function getBuyerAddresses() {
  const response = await apiClient.get<ApiSuccess<{ addresses: BuyerAddress[] }>>("/api/users/me/addresses");
  return response.data.data.addresses;
}

export async function createBuyerAddress(input: AddressInput) {
  const response = await apiClient.post<ApiSuccess<{ address: BuyerAddress }>>("/api/users/me/addresses", input);
  return response.data.data.address;
}

export async function updateBuyerAddress(addressId: string, input: AddressInput) {
  const response = await apiClient.patch<ApiSuccess<{ address: BuyerAddress }>>(`/api/users/me/addresses/${addressId}`, input);
  return response.data.data.address;
}

export async function deleteBuyerAddress(addressId: string) {
  await apiClient.delete(`/api/users/me/addresses/${addressId}`);
}

export async function setDefaultBuyerAddress(addressId: string) {
  const response = await apiClient.patch<ApiSuccess<{ address: BuyerAddress }>>(`/api/users/me/addresses/${addressId}/default`, {});
  return response.data.data.address;
}

export async function logoutBuyer() {
  await apiClient.post<ApiSuccess<never>>("/api/auth/logout", {});
  window.dispatchEvent(new Event(BUYER_AUTH_CHANGED));
}
