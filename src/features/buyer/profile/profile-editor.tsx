"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, UserRound } from "lucide-react";
import { buyerDisplayName, getAuthErrorMessage } from "@/features/buyer/auth/auth-api";
import { updateBuyerProfile, type BuyerProfile } from "./profile-api";

export function ProfileEditor({ initialProfile, contactOnly = false }: { initialProfile: BuyerProfile; contactOnly?: boolean }) {
  const [profile, setProfile] = useState(initialProfile);
  const [name, setName] = useState(initialProfile.name ?? "");
  const [email, setEmail] = useState(initialProfile.email ?? "");
  const [profileImage, setProfileImage] = useState(initialProfile.profileImage ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanImage = profileImage.trim();

    if (cleanName.length > 100) {
      setError("Name must contain no more than 100 characters.");
      return;
    }

    if (cleanImage) {
      try {
        const url = new URL(cleanImage);
        if (url.protocol !== "https:") throw new Error();
      } catch {
        setError("Profile image must be a valid HTTPS URL.");
        return;
      }
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const updated = await updateBuyerProfile({ name: cleanName || null, email: cleanEmail || null, profileImage: cleanImage || null });
      setProfile((current) => ({ ...current, ...updated }));
      setName(updated.name ?? "");
      setEmail(updated.email ?? "");
      setProfileImage(updated.profileImage ?? "");
      setSuccess("Profile updated successfully.");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section aria-labelledby="profile-heading">
      {contactOnly ? <h2 id="profile-heading" className="text-lg font-semibold">Personal details</h2> : <div className="flex flex-col gap-5 border-b border-neutral-200 pb-7 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-100">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="Buyer profile" className="h-full w-full object-cover" />
          ) : (
            <UserRound className="h-8 w-8 text-neutral-500" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase text-neutral-500">Profile</p>
          <h1 id="profile-heading" className="mt-1 text-2xl font-semibold">{buyerDisplayName(profile)}</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your personal information.</p>
        </div>
      </div>}

      <form onSubmit={handleSubmit} className="py-7" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Name
            <input
              value={name}
              onChange={(event) => { setName(event.target.value); setError(""); setSuccess(""); }}
              maxLength={100}
              autoComplete="name"
              className="mt-2 h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-950"
            />
          </label>
          <label className="text-sm font-medium">
            Email (optional)
            <input value={email} onChange={(event) => { setEmail(event.target.value); setError(""); setSuccess(""); }} type="email" maxLength={254} autoComplete="email" className="mt-2 h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-950" />
          </label>
          {!contactOnly ? <label className="text-sm font-medium">
            Profile image URL
            <input
              value={profileImage}
              onChange={(event) => { setProfileImage(event.target.value); setError(""); setSuccess(""); }}
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="mt-2 h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-950"
            />
          </label> : null}
        </div>

        <div className="mt-5 min-h-5 text-sm">
          {error ? <p role="alert" className="text-red-600">{error}</p> : null}
          {success ? <p role="status" className="flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" />{success}</p> : null}
        </div>

        <button type="submit" disabled={isSaving} className="mt-3 inline-flex h-11 items-center gap-2 bg-neutral-950 px-6 text-sm font-semibold text-white disabled:opacity-50">
          {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isSaving ? "Saving" : "Save profile"}
        </button>
      </form>
    </section>
  );
}
