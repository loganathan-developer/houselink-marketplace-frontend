import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ApiError, ApiSuccess } from "@/types/api";

export type BuyerUser = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string;
  roles: string[];
};

type OtpChallenge = { challengeId: string };
type AuthenticatedBuyer = { user: BuyerUser };

export function buyerDisplayName(buyer: { name?: string | null; email?: string | null; phone?: string | null }) {
  return buyer.name?.trim() || buyer.email?.trim().split("@")[0] || "Buyer";
}

export async function requestPhoneOtp(phone: string) {
  const response = await apiClient.post<ApiSuccess<OtpChallenge>>("/api/auth/otp/request", {
    phone,
    channel: "PHONE",
    purpose: "LOGIN",
  });

  return response.data.data;
}

export async function verifyPhoneOtp(challengeId: string, otp: string) {
  const response = await apiClient.post<ApiSuccess<AuthenticatedBuyer>>("/api/auth/otp/verify", {
    challengeId,
    otp,
  });

  return response.data.data;
}

export async function getCurrentBuyer() {
  const response = await apiClient.get<ApiSuccess<AuthenticatedBuyer>>("/api/auth/me");
  return response.data.data.user;
}

export function getAuthErrorMessage(error: unknown) {
  if (!axios.isAxiosError<ApiError>(error)) {
    return "Something went wrong. Please try again.";
  }

  if (!error.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (error.response.status === 429) {
    return "Too many attempts. Please wait a moment before trying again.";
  }

  return error.response.data?.error?.message ?? "The request could not be completed.";
}
