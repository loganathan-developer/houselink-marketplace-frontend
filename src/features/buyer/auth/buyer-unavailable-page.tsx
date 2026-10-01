import Link from "next/link";
import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { routes } from "@/lib/routes";
import { BuyerAccess } from "./buyer-access";

export function BuyerUnavailablePage({ title, destination }: { title: string; destination: string }) {
  return <div className="min-h-screen bg-white"><SiteHeader data={homeMockData.header} /><BuyerAccess destination={destination}><main className="mx-auto max-w-5xl px-5 py-12"><h1 className="text-2xl font-semibold">{title}</h1><p className="mt-4 text-sm text-neutral-500">{title} is not available yet.</p><Link href={routes.home} className="mt-6 inline-block text-sm underline">Shop</Link></main></BuyerAccess></div>;
}
