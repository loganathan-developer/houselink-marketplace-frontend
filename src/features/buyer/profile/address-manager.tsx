"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Check, LoaderCircle, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { buyerLoginHref } from "../auth/buyer-access";
import { getAuthErrorMessage } from "@/features/buyer/auth/auth-api";
import {
  createBuyerAddress,
  deleteBuyerAddress,
  getBuyerAddresses,
  setDefaultBuyerAddress,
  updateBuyerAddress,
  type AddressInput,
  type BuyerAddress,
} from "./profile-api";

const emptyAddress: AddressInput = {
  recipientName: "",
  contactPhone: "",
  addressLine1: "",
  addressLine2: null,
  city: "",
  state: "",
  postalCode: "",
  country: "IN",
  isDefault: false,
};

export function AddressManager({ standalone = false }: { standalone?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [form, setForm] = useState<AddressInput>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUnauthorized = (requestError: unknown) => {
    if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
      router.replace(buyerLoginHref(pathname));
      return true;
    }
    return false;
  };

  useEffect(() => {
    let isActive = true;
    getBuyerAddresses()
      .then((items) => { if (isActive) setAddresses(items); })
      .catch((requestError) => {
        if (isActive && !handleUnauthorized(requestError)) setError(getAuthErrorMessage(requestError));
      })
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyAddress);
    setError("");
    setFormError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const openEditForm = (address: BuyerAddress) => {
    setEditingId(address.id);
    setForm({
      recipientName: address.recipientName,
      contactPhone: address.contactPhone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setError("");
    setFormError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const validateAddress = () => {
    if (![form.recipientName, form.addressLine1, form.city, form.state, form.postalCode].every((value) => value.trim())) return "Complete all required address fields.";
    if (!/^\+[1-9]\d{7,14}$/.test(form.contactPhone.trim())) return "Use an international phone number such as +919876543210.";
    if (!/^[A-Za-z0-9 -]{1,20}$/.test(form.postalCode.trim())) return "Enter a valid postal code.";
    if (!/^[A-Za-z]{2}$/.test(form.country.trim())) return "Country must be a two-letter code.";
    return "";
  };

  const submitAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateAddress();
    if (validationError) { setFormError(validationError); return; }

    const input: AddressInput = {
      ...form,
      recipientName: form.recipientName.trim(),
      contactPhone: form.contactPhone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2?.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim().toUpperCase(),
    };

    setFormError("");
    setPendingAction("save");
    try {
      const saved = editingId ? await updateBuyerAddress(editingId, input) : await createBuyerAddress(input);
      setAddresses((current) => {
        const next = editingId ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved];
        return saved.isDefault ? next.map((item) => ({ ...item, isDefault: item.id === saved.id })) : next;
      });
      setSuccess(editingId ? "Address updated." : "Address added.");
      setIsFormOpen(false);
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) setFormError(getAuthErrorMessage(requestError));
    } finally {
      setPendingAction(null);
    }
  };

  const removeAddress = async (addressId: string) => {
    if (!window.confirm("Delete this address?")) return;
    setError(""); setSuccess(""); setPendingAction(addressId);
    try {
      await deleteBuyerAddress(addressId);
      setAddresses((current) => current.filter((item) => item.id !== addressId));
      setSuccess("Address deleted.");
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) setError(getAuthErrorMessage(requestError));
    } finally { setPendingAction(null); }
  };

  const makeDefault = async (addressId: string) => {
    setError(""); setSuccess(""); setPendingAction(addressId);
    try {
      const updated = await setDefaultBuyerAddress(addressId);
      setAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === updated.id })));
      setSuccess("Default address updated.");
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) setError(getAuthErrorMessage(requestError));
    } finally { setPendingAction(null); }
  };

  return (
    <section id="addresses" aria-labelledby="addresses-heading" className={standalone ? "" : "scroll-mt-6 border-t border-neutral-200 pt-8"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="addresses-heading" className="text-lg font-semibold">Saved addresses</h2>
          <p className="mt-1 text-sm text-neutral-500">Manage delivery locations for your account.</p>
        </div>
        <button type="button" onClick={openAddForm} className="inline-flex h-10 shrink-0 items-center gap-2 bg-neutral-950 px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Add address
        </button>
      </div>

      <div className="mt-4 min-h-5 text-sm">
        {error && !isFormOpen ? <p role="alert" className="text-red-600">{error}</p> : null}
        {success ? <p role="status" className="flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" />{success}</p> : null}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-neutral-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading addresses</div>
      ) : addresses.length === 0 ? (
        <div className="mt-4 border border-dashed border-neutral-300 px-5 py-10 text-center">
          <MapPin className="mx-auto h-6 w-6 text-neutral-400" />
          <p className="mt-3 text-sm font-medium">No saved addresses</p>
          <p className="mt-1 text-xs text-neutral-500">Add an address for faster checkout.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className={`relative border p-5 ${address.isDefault ? "border-neutral-950" : "border-neutral-200"}`}>
              {address.isDefault ? <span className="absolute right-4 top-4 bg-neutral-950 px-2 py-1 text-[10px] font-semibold uppercase text-white">Default</span> : null}
              <h3 className="pr-20 text-sm font-semibold">{address.recipientName}</h3>
              <address className="mt-3 text-sm not-italic leading-6 text-neutral-600">
                {address.addressLine1}<br />
                {address.addressLine2 ? <>{address.addressLine2}<br /></> : null}
                {address.city}, {address.state} {address.postalCode}<br />
                {address.country}<br />
                {address.contactPhone}
              </address>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
                <button type="button" onClick={() => openEditForm(address)} className="inline-flex h-9 items-center gap-2 px-3 text-xs font-semibold hover:bg-neutral-100"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                {!address.isDefault ? <button type="button" disabled={pendingAction === address.id} onClick={() => makeDefault(address.id)} className="inline-flex h-9 items-center gap-2 px-3 text-xs font-semibold hover:bg-neutral-100 disabled:opacity-50"><Star className="h-3.5 w-3.5" /> Set default</button> : null}
                <button type="button" disabled={pendingAction === address.id} onClick={() => removeAddress(address.id)} className="ml-auto inline-flex h-9 items-center gap-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="address-form-title">
          <div className="my-6 w-full max-w-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 id="address-form-title" className="text-xl font-semibold">{editingId ? "Edit address" : "Add address"}</h2>
              <button type="button" onClick={() => { setIsFormOpen(false); setFormError(""); }} aria-label="Close address form" className="grid h-9 w-9 place-items-center hover:bg-neutral-100"><X className="h-5 w-5" /></button>
            </div>
            <AddressForm form={form} setForm={setForm} onSubmit={submitAddress} error={formError} isSaving={pendingAction === "save"} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function AddressForm({ form, setForm, onSubmit, error, isSaving }: { form: AddressInput; setForm: (value: AddressInput) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string; isSaving: boolean }) {
  const field = (key: keyof AddressInput, value: string | boolean | null) => setForm({ ...form, [key]: value });
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
      <AddressInputField label="Recipient name" value={form.recipientName} onChange={(value) => field("recipientName", value)} autoComplete="name" />
      <AddressInputField label="Contact phone" value={form.contactPhone} onChange={(value) => field("contactPhone", value)} placeholder="+919876543210" autoComplete="tel" />
      <div className="sm:col-span-2"><AddressInputField label="Address line 1" value={form.addressLine1} onChange={(value) => field("addressLine1", value)} autoComplete="address-line1" /></div>
      <div className="sm:col-span-2"><AddressInputField label="Address line 2 (optional)" value={form.addressLine2 ?? ""} onChange={(value) => field("addressLine2", value || null)} autoComplete="address-line2" required={false} /></div>
      <AddressInputField label="City" value={form.city} onChange={(value) => field("city", value)} autoComplete="address-level2" />
      <AddressInputField label="State" value={form.state} onChange={(value) => field("state", value)} autoComplete="address-level1" />
      <AddressInputField label="Postal code" value={form.postalCode} onChange={(value) => field("postalCode", value)} autoComplete="postal-code" />
      <AddressInputField label="Country code" value={form.country} onChange={(value) => field("country", value.toUpperCase().slice(0, 2))} placeholder="IN" autoComplete="country" />
      <label className="flex items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" checked={form.isDefault} onChange={(event) => field("isDefault", event.target.checked)} className="h-4 w-4 accent-neutral-950" /> Set as default address</label>
      {error ? <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
      <button type="submit" disabled={isSaving} className="mt-2 inline-flex h-11 items-center justify-center gap-2 bg-neutral-950 px-6 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2 sm:w-fit">
        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{isSaving ? "Saving" : "Save address"}
      </button>
    </form>
  );
}

function AddressInputField({ label, value, onChange, placeholder, autoComplete, required = true }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; autoComplete?: string; required?: boolean }) {
  return <label className="block text-sm font-medium">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} required={required} className="mt-2 h-11 w-full border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-950" /></label>;
}
