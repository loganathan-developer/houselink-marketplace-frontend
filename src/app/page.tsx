import { Banner } from "@/components/home/banner";
import { Explore } from "@/components/home/explore";
import { Footer } from "@/components/home/footer";
import { SiteHeader } from "@/components/home/site-header";
import { NewArrivals } from "@/components/home/new-arrivals";
import { WearIt } from "@/components/home/wear-it";
import { homeMockData } from "@/data/home.mock";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-neutral-950">
      <SiteHeader data={homeMockData.header} />
      <Banner data={homeMockData.banner} />
      <NewArrivals data={homeMockData.newArrivals} />
      <Explore data={homeMockData.explore} />
      <WearIt data={homeMockData.wearIt} />
      <Footer data={homeMockData.footer} />
    </main>
  );
}
