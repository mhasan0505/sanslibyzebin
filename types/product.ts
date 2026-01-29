export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  inStock?: boolean;
  featured?: boolean;
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
  priceRange?: [number, number];
  inStock?: boolean;
  sortBy?: "name" | "price-asc" | "price-desc" | "newest";
}
