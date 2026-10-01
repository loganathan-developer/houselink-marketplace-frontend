import { SiteHeader } from "@/components/home/site-header";
import { homeMockData } from "@/data/home.mock";
import { BuyerProfileView } from "@/features/buyer/profile/buyer-profile-view";
import { routes } from "@/lib/routes";
import { BuyerAccess } from "@/features/buyer/auth/buyer-access";

export default function BuyerProfilePage() {
  return (
    <div className="min-h-screen text-neutral-950">
      <SiteHeader data={homeMockData.header} />
      <BuyerAccess destination={routes.buyer.profile}><BuyerProfileView /></BuyerAccess>
    </div>
  );
}
