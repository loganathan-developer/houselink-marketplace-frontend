import { SiteHeader } from "@/components/home/site-header";
import { Footer } from "@/components/home/footer";
import { homeMockData } from "@/data/home.mock";
import { BuyerBag } from "@/features/cart/buyer-bag";
import { BuyerAccess } from "@/features/buyer/auth/buyer-access";

export default function BuyerBagPage() {
  return <div className="min-h-screen bg-white text-neutral-950"><SiteHeader data={homeMockData.header} /><BuyerAccess destination="/buyer/bag"><BuyerBag /></BuyerAccess><Footer data={homeMockData.footer} /></div>;
}
