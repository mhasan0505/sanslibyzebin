import { Product } from "@/types/product";

/**
 * Format a number as currency (Bangladeshi Taka)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse price string to number with validation
 * Example: "₹ 45,000" -> 45000
 * @throws {Error} if price is invalid
 */
export function parsePriceStrict(priceString: string): number {
  const parsed = parseInt(priceString.replace(/[₹,\s]/g, ""), 10);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(`Invalid price format: ${priceString}`);
  }
  return parsed;
}

/**
 * Parse price string to number (legacy function for backward compatibility)
 * Example: "₹ 45,000" -> 45000
 */
export function parsePrice(priceString: string): number {
  return parseInt(priceString.replace(/[₹,\s]/g, ""), 10);
}

/**
 * Safely parse price with fallback value
 * @param priceString - Price string to parse
 * @param fallback - Value to return if parsing fails (default: 0)
 */
export function parsePriceSafe(
  priceString: string,
  fallback: number = 0,
): number {
  try {
    return parsePriceStrict(priceString);
  } catch (error) {
    console.warn(
      `Failed to parse price: ${priceString}, using fallback: ${fallback}`,
    );
    return fallback;
  }
}

/**
 * Validate if a price string is valid
 */
export function isValidPrice(priceString: string): boolean {
  try {
    parsePriceStrict(priceString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Search products by name, description, or category
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Filter products by category
 */
export function filterByCategory(
  products: Product[],
  category: string,
): Product[] {
  if (category === "All") return products;
  return products.filter((product) => product.category === category);
}

/**
 * Sort products
 */
export function sortProducts(
  products: Product[],
  sortBy: "name" | "price-asc" | "price-desc" | "newest",
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "price-asc":
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "price-desc":
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(imagePath: string): string {
  return imagePath || "/placeholder.png";
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
