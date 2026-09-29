export const routes = {
  home: "/",
  buyer: {
    login: "/buyer/login",
    profile: "/buyer/profile",
    addresses: "/buyer/addresses",
    categories: "/buyer/categories",
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
