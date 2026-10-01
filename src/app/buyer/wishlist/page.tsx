import { SiteHeader } from "@/components/home/site-header";
import { Footer } from "@/components/home/footer";
import { homeMockData } from "@/data/home.mock";
import { BuyerAccess } from "@/features/buyer/auth/buyer-access";
import { BuyerWishlist } from "@/features/wishlist/buyer-wishlist";

export default function BuyerWishlistPage() {
  return <div className="min-h-screen bg-white"><SiteHeader data={homeMockData.header} /><BuyerAccess destination="/buyer/wishlist"><BuyerWishlist /></BuyerAccess><Footer data={homeMockData.footer} /></div>;
}
