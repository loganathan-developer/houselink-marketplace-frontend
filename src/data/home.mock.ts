import { routes } from "@/lib/routes";

export type NavItem = {
  label: string;
  href: string;
  featured?: boolean;
};

export type HeaderAction = {
  id: "search" | "profile" | "wishlist" | "bag";
  label: string;
  href: string;
};

export type HeaderData = {
  brand: string;
  homeHref: string;
  navItems: NavItem[];
  actions: HeaderAction[];
};

export type BannerData = {
  eyebrow: string;
  title: string;
  emphasizedTitle: string;
  description: string;
  cta: NavItem;
  collectionCount: string;
  collectionCaption: string;
  perspective: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  volumeLabel: string;
  feature: NavItem & { eyebrow: string };
};

export type Product = {
  id: string;
  name: string;
  material: string;
  price: string;
  image: string;
  href: string;
  badge: string;
  swatches: string[];
};

export type NewArrivalsData = {
  eyebrow: string;
  title: string;
  emphasizedTitle: string;
  filters: string[];
  cta: NavItem;
  products: Product[];
};

export type ExploreCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type ExploreData = {
  eyebrow: string;
  title: string;
  emphasizedTitle: string;
  cards: ExploreCard[];
};

export type WearItItem = {
  id: string;
  label: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type WearItData = {
  eyebrow: string;
  title: string;
  emphasizedTitle: string;
  socialCta: NavItem;
  items: WearItItem[];
};

export type FooterLink = NavItem;

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  label: string;
  shortLabel: string;
  href: string;
};

export type FooterData = {
  brand: string;
  homeHref: string;
  description: string;
  tagline: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    consentLabel: string;
  };
  copyright: string;
  legalLinks: FooterLink[];
  localeLabel: string;
};

export type HomePageData = {
  header: HeaderData;
  banner: BannerData;
  newArrivals: NewArrivalsData;
  explore: ExploreData;
  wearIt: WearItData;
  footer: FooterData;
};

const categoryHref = routes.buyer.categories;
const brandHref = routes.buyer.brands;

export const homeMockData: HomePageData = {
  header: {
    brand: "FORM\u00C9",
    homeHref: routes.home,
    navItems: [
      { label: "Men", href: `${categoryHref}?department=men` },
      { label: "Women", href: `${categoryHref}?department=women` },
      { label: "Kids", href: `${categoryHref}?department=kids` },
      { label: "Beauty", href: `${categoryHref}?department=beauty` },
      { label: "Footwear", href: `${categoryHref}?department=footwear` },
      { label: "Accessories", href: `${categoryHref}?department=accessories` },
      { label: "New Arrivals", href: routes.buyer.newArrivals },
      { label: "Sale", href: routes.buyer.sale, featured: true },
    ],
    actions: [
      { id: "search", label: "Search", href: categoryHref },
      { id: "profile", label: "Profile", href: routes.buyer.login },
      { id: "wishlist", label: "Wishlist", href: categoryHref },
      { id: "bag", label: "Bag", href: categoryHref },
    ],
  },
  banner: {
    eyebrow: "The everyday, reimagined / No. 01",
    title: "Good style.",
    emphasizedTitle: "No noise.",
    description:
      "Considered pieces. Unexpected combinations. A wardrobe that feels like you.",
    cta: { label: "Discover the new collection", href: categoryHref },
    collectionCount: "01 - 12",
    collectionCaption: "Pieces worth knowing",
    perspective: "A different point of view.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Two models wearing modern neutral outfits",
    imageLabel: "The FORME perspective",
    volumeLabel: "Vol. 01 - Everyday icons",
    feature: {
      eyebrow: "The collection in focus",
      label: "Modern essentials for a brighter you.",
      href: brandHref,
    },
  },
  newArrivals: {
    eyebrow: "Fresh perspective",
    title: "Just",
    emphasizedTitle: "arrived.",
    filters: ["All pieces", "Women", "Men"],
    cta: { label: "Meet the new pieces", href: categoryHref },
    products: [
      {
        id: "sculpt-blazer",
        name: "The Sculpt Blazer",
        material: "Viscose blend",
        price: "INR 5,990",
        image:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "Just arrived",
        swatches: ["#050505", "#9c9992", "#e5ddcf"],
      },
      {
        id: "sunday-knit",
        name: "The Sunday Knit",
        material: "Cotton blend",
        price: "INR 3,290",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "Just arrived",
        swatches: ["#e5ded0", "#d98f92", "#777c75"],
      },
      {
        id: "blue-hour-shirt",
        name: "Blue Hour Shirt",
        material: "100% cotton",
        price: "INR 2,490",
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "Just arrived",
        swatches: ["#a7b9d3", "#f5f4ef", "#080827"],
      },
      {
        id: "arc-wide-leg-denim",
        name: "Arc Wide-leg Denim",
        material: "100% cotton denim",
        price: "INR 2,990",
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "Just arrived",
        swatches: ["#060b3d", "#6178a5", "#becbe0"],
      },
      {
        id: "essential-crew-tee",
        name: "Essential Crew Tee",
        material: "Organic cotton jersey",
        price: "INR 1,490",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "New season",
        swatches: ["#f4f1e8", "#191919", "#9b9d96"],
      },
      {
        id: "relaxed-overshirt",
        name: "Relaxed Overshirt",
        material: "Brushed cotton twill",
        price: "INR 3,790",
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "New season",
        swatches: ["#867761", "#2e3538", "#d8d0c2"],
      },
      {
        id: "soft-structure-dress",
        name: "Soft Structure Dress",
        material: "Linen blend",
        price: "INR 4,490",
        image:
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=85",
        href: categoryHref,
        badge: "Limited edition",
        swatches: ["#171717", "#c8b7a4", "#8c3f3f"],
      },
    ],
  },
  explore: {
    eyebrow: "Style in real life",
    title: "More to",
    emphasizedTitle: "explore.",
    cards: [
      {
        id: "quiet-luxury",
        eyebrow: "The edit",
        title: "Quiet Luxury",
        description: "Pieces that stay with you.",
        ctaLabel: "Explore the edit",
        href: brandHref,
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Woman wearing a refined black evening outfit",
      },
      {
        id: "built-different",
        eyebrow: "For men",
        title: "Built Different",
        description: "Clean looks. Strong impressions.",
        ctaLabel: "Shop men",
        href: categoryHref,
        image:
          "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85",
        imageAlt: "Man wearing a modern monochrome outfit",
      },
    ],
  },
  wearIt: {
    eyebrow: "Style in real life",
    title: "How you",
    emphasizedTitle: "wear it.",
    socialCta: {
      label: "Tag @forme to be featured",
      href: "https://www.instagram.com/",
    },
    items: [
      { id: "men", label: "Men", href: categoryHref, image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=700&q=85", imageAlt: "Man in a relaxed black shirt" },
      { id: "women", label: "Women", href: categoryHref, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85", imageAlt: "Woman in polished everyday styling" },
      { id: "new-arrivals", label: "New arrivals", href: categoryHref, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=85", imageAlt: "Neutral clothing collection on a rail" },
      { id: "casuals", label: "Casuals", href: categoryHref, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85", imageAlt: "Model in elevated casual clothing" },
      { id: "accessories", label: "Accessories", href: brandHref, image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?auto=format&fit=crop&w=700&q=85", imageAlt: "Curated fashion accessories" },
      { id: "occasion", label: "Occasion", href: categoryHref, image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85", imageAlt: "Woman in a black occasion dress" },
    ],
  },
  footer: {
    brand: "FORM\u00C9",
    homeHref: routes.home,
    description: "Clothing for the way you see the world. Considered pieces. Your point of view.",
    tagline: "Wear it your way.",
    sections: [
      { title: "Shop", links: ["All pieces", "Women", "Men", "New arrivals", "Top of the week", "Archive sale"].map((label) => ({ label, href: categoryHref })) },
      { title: "About", links: ["Our story", "Sustainability", "Journal", "Careers", "Press"].map((label) => ({ label, href: brandHref })) },
      { title: "Help", links: ["Delivery & returns", "Find your size", "Track an order", "FAQ", "Contact us"].map((label) => ({ label, href: routes.home })) },
    ],
    socialLinks: [
      { label: "Instagram", shortLabel: "IG", href: "https://www.instagram.com/" },
      { label: "Facebook", shortLabel: "FB", href: "https://www.facebook.com/" },
      { label: "YouTube", shortLabel: "YT", href: "https://www.youtube.com/" },
      { label: "Pinterest", shortLabel: "PT", href: "https://www.pinterest.com/" },
    ],
    newsletter: {
      title: "Join our world",
      description: "Be the first to know about new arrivals, exclusive drops and more.",
      placeholder: "Your email address",
      consentLabel: "I agree to receive updates from FORME",
    },
    copyright: "\u00A9 2026 FORME. All rights reserved.",
    legalLinks: ["Privacy", "Terms", "Cookies"].map((label) => ({ label, href: routes.home })),
    localeLabel: "India | INR",
  },
};
