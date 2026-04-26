import { products } from "@/app/data/products";
import { Product } from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getAllProductIds(): string[] {
  return products.map((product) => String(product.id));
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

export function getRelatedProducts(
  product: Product,
  limit: number = 3,
): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id,
    )
    .slice(0, limit);
}
