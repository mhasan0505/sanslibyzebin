export const NAVIGATION_ITEMS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Salwar Kameez", href: "/salwar-kameez" },
  { label: "Sarees", href: "/sarees" },
  { label: "Kurtis", href: "/kurtis" },
  { label: "Gowns", href: "/gowns" },
  { label: "About", href: "/about" },
] as const;

export const SHOP_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Salwar Kameez", href: "/salwar-kameez" },
  { label: "Sarees", href: "/sarees" },
  { label: "Lehengas", href: "/lehengas" },
  { label: "Modest Wear", href: "/modest-wear" },
] as const;

export const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQ", href: "/faq" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  twitter: "#",
} as const;

export const CATEGORIES = [
  "All",
  "Salwar Kameez",
  "Sarees",
  "Kurtis",
  "Gowns",
  "Modest Wear",
] as const;

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Name (A-Z)", value: "name" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
] as const;

export const SITE_METADATA = {
  title: "Sansli By Zebin | Premium Traditional Wear",
  description:
    "Exclusive collection of Salwar Kameez, Sarees, and Fusion wear for the modern Bangladeshi woman.",
  keywords:
    "Salwar Kameez, Saree, Bangladeshi fashion, luxury clothing, ladies dress",
} as const;
