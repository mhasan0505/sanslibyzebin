export type ProductLandingVariantKey =
  | "eid-launch"
  | "remarketing"
  | "new-arrival";

export interface ProductLandingVariantCopy {
  badge?: string;
  headline?: string;
  subheadline?: string;
  offerText?: string;
  primaryCta?: string;
  benefits?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  description: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  landingPage?: {
    badge?: string;
    headline?: string;
    subheadline?: string;
    offerText?: string;
    primaryCta?: string;
    benefits?: string[];
    metaTitle?: string;
    metaDescription?: string;
    variantOverrides?: Partial<
      Record<ProductLandingVariantKey, ProductLandingVariantCopy>
    >;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface FilterOptions {
  category?: string;
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  sortBy?: "name" | "price-asc" | "price-desc" | "newest";
}
