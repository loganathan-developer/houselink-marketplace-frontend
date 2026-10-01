export const routes = {
  home: "/",
  buyer: {
    login: "/buyer/login",
    profile: "/buyer/profile",
    addresses: "/buyer/profile#addresses",
    bag: "/buyer/bag",
    categories: "/buyer/categories",
    newArrivals: "/buyer/categories?collection=new-arrivals",
    sale: "/buyer/categories?collection=sale",
    brands: "/buyer/brands",
  },
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    categories: "/admin/categories",
    attributes: "/admin/attributes",
    brands: "/admin/brands",
    media: "/admin/media",
  },
} as const;

export function safeBuyerReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return routes.home;
  try {
    const url = new URL(value, "https://buyer.local");
    const pathname = decodeURIComponent(url.pathname);
    if (url.origin !== "https://buyer.local" || /[\\\u0000-\u0020]/.test(pathname) || pathname.startsWith("//") || pathname.startsWith("/api") || pathname.startsWith("/admin") || pathname.startsWith(routes.buyer.login)) return routes.home;
    return url.pathname + url.search + url.hash;
  } catch { return routes.home; }
}

export function buyerLoginHref(destination: string) {
  return `${routes.buyer.login}?returnTo=${encodeURIComponent(safeBuyerReturnTo(destination))}`;
}
