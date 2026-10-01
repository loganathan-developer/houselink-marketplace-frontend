import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function BuyerAddressesPage() {
  redirect(routes.buyer.addresses);
}
