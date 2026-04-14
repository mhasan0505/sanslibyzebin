export const NAVIGATION_ITEMS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Co-Ords", href: "/co-ords" },
  { label: "3 Piece Sets", href: "/3-piece-sets" },
  { label: "Kurtis", href: "/kurtis" },
  { label: "Gowns", href: "/gowns" },
  { label: "About", href: "/about" },
] as const;

export const SHOP_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "3 Piece Sets", href: "/3-piece-sets" },
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
  "3 Piece Sets",
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
    "Exclusive collection of 3 Piece Sets, Sarees, and Fusion wear for the modern Bangladeshi woman.",
  keywords:
    "3 Piece Sets, Saree, Bangladeshi fashion, luxury clothing, ladies dress",
} as const;
