"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { routes } from "@/lib/routes";
import { getAuthErrorMessage, requestPhoneOtp, verifyPhoneOtp } from "./auth-api";
import { BUYER_AUTH_CHANGED, safeBuyerReturnTo } from "./buyer-access";

type LoginStep = "phone" | "otp";

function normalizePhone(value: string) {
  return value.trim().replace(/[\s()-]/g, "");
}

export function BuyerLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const submitPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = normalizePhone(phone);

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError("Enter a valid international phone number, for example +91 98765 43210.");
      return;
    }

    if (!hasAcceptedTerms) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const challenge = await requestPhoneOtp(normalizedPhone);
      setPhone(normalizedPhone);
      setChallengeId(challenge.challengeId);
      setOtp("");
      setStep("otp");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  const submitOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit OTP sent to your phone.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await verifyPhoneOtp(challengeId, otp);
      window.dispatchEvent(new Event(BUYER_AUTH_CHANGED));
      router.replace(safeBuyerReturnTo(new URLSearchParams(window.location.search).get("returnTo")));
      router.refresh();
    } catch (verifyError) {
      setError(getAuthErrorMessage(verifyError));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhone = () => {
    setStep("phone");
    setChallengeId("");
    setOtp("");
    setError("");
  };

  return (
    <div className="w-full">
      <div>
        <h1 className="text-xl font-semibold leading-tight">
          {step === "phone" ? "Login or Signup" : "Verify your number"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {step === "phone"
            ? "Use your mobile number to continue securely."
            : `We sent a six-digit verification code to ${phone}.`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={submitPhone} className="mt-8" noValidate>
          <label htmlFor="phone" className="text-sm font-medium">Phone number</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError("");
            }}
            placeholder="+91 98765 43210"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            className="mt-2 h-13 w-full border border-neutral-300 bg-white px-4 text-base outline-none transition focus:border-neutral-950"
          />
          <p className="mt-2 text-xs leading-5 text-neutral-500">Include your country code.</p>
          <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-neutral-600">
            <input
              type="checkbox"
              checked={hasAcceptedTerms}
              onChange={(event) => {
                setHasAcceptedTerms(event.target.checked);
                setError("");
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-950"
            />
            <span>
              I agree to the <Link href={routes.home} className="font-semibold text-[#ee3a21]">Terms of Use</Link> and <Link href={routes.home} className="font-semibold text-[#ee3a21]">Privacy Policy</Link>.
            </span>
          </label>
          <LoginError message={error} />
          <SubmitButton isLoading={isLoading} label="Continue" loadingLabel="Sending OTP" />
        </form>
      ) : (
        <form onSubmit={submitOtp} className="mt-8" noValidate>
          <label htmlFor="otp" className="text-sm font-medium">Verification code</label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            placeholder="000000"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            className="mt-2 h-14 w-full border border-neutral-300 bg-white px-4 text-center text-2xl tracking-[0.35em] outline-none transition focus:border-neutral-950"
          />
          <LoginError message={error} />
          <SubmitButton isLoading={isLoading} label="Verify and continue" loadingLabel="Verifying" />
          <button
            type="button"
            onClick={resetPhone}
            disabled={isLoading}
            className="mt-4 w-full text-sm text-neutral-600 underline underline-offset-4 disabled:opacity-50"
          >
            Use a different phone number
          </button>
        </form>
      )}

      <p className="mt-7 text-xs text-neutral-500">
        Having trouble logging in? <Link href={routes.home} className="font-semibold text-[#ee3a21]">Get help</Link>
      </p>
    </div>
  );
}

function LoginError({ message }: { message: string }) {
  return message ? (
    <p id="login-error" role="alert" className="mt-3 text-sm text-red-600">{message}</p>
  ) : null;
}

function SubmitButton({ isLoading, label, loadingLabel }: { isLoading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="mt-6 flex h-13 w-full items-center justify-center gap-3 bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {isLoading ? loadingLabel : label}
      {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
    </button>
  );
}
