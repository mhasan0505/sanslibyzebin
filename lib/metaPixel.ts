import { CURRENCY } from "@/lib/constants";
import { CartItem, Product } from "@/types/product";
import { parsePriceSafe } from "@/utils/helpers";

declare global {
  interface Window {
    fbq?: (
      command: "init" | "track",
      eventNameOrPixelId: string,
      parameters?: Record<string, unknown>,
    ) => void;
  }
}

type CheckoutMethod = "whatsapp" | "email";

type MetaPixelEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

function canTrackMetaPixel(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function track(
  event: MetaPixelEvent,
  parameters?: Record<string, unknown>,
): void {
  if (!canTrackMetaPixel()) return;
  window.fbq?.("track", event, parameters);
}

function getProductUnitPrice(product: Product): number {
  if (
    typeof product.priceValue === "number" &&
    !Number.isNaN(product.priceValue)
  ) {
    return product.priceValue;
  }

  return parsePriceSafe(product.price, 0);
}

function getCartValue(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + getProductUnitPrice(item.product) * item.quantity;
  }, 0);
}

export function trackPageView(path?: string): void {
  track("PageView", path ? { page_path: path } : undefined);
}

export function trackViewContent(product: Product): void {
  track("ViewContent", {
    content_ids: [String(product.id)],
    content_type: "product",
    content_name: product.name,
    value: getProductUnitPrice(product),
    currency: CURRENCY.CODE,
  });
}

export function trackAddToCart(params: {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}): void {
  const { product, quantity, selectedSize, selectedColor } = params;
  const value = getProductUnitPrice(product) * quantity;

  track("AddToCart", {
    content_ids: [String(product.id)],
    content_type: "product",
    content_name: product.name,
    value,
    currency: CURRENCY.CODE,
    quantity,
    size: selectedSize,
    color: selectedColor,
  });
}

export function trackInitiateCheckout(items: CartItem[]): void {
  if (items.length === 0) return;

  track("InitiateCheckout", {
    content_ids: items.map((item) => String(item.product.id)),
    content_type: "product",
    num_items: items.reduce((count, item) => count + item.quantity, 0),
    value: getCartValue(items),
    currency: CURRENCY.CODE,
  });
}

export function trackPurchase(params: {
  items: CartItem[];
  orderValue: number;
  method: CheckoutMethod;
}): void {
  const { items, orderValue, method } = params;

  if (items.length === 0) return;

  track("Purchase", {
    content_ids: items.map((item) => String(item.product.id)),
    content_type: "product",
    num_items: items.reduce((count, item) => count + item.quantity, 0),
    value: orderValue,
    currency: CURRENCY.CODE,
    checkout_method: method,
  });
}
