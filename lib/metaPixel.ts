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

type CheckoutMethod = "whatsapp" | "email" | "landing";

type MetaPixelEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

function getAttributionContext(): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  const context: Record<string, unknown> = {};
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const searchParams = new URLSearchParams(window.location.search);

  if (pathSegments[0] === "lp") {
    if (pathSegments[1] && pathSegments[1] !== "checkout") {
      context.lp_slug = pathSegments[1];
    }
    if (pathSegments[2]) {
      context.lp_variant = pathSegments[2];
    }
  }

  const checkoutSlug = searchParams.get("lp_slug");
  const checkoutVariant = searchParams.get("lp_variant");

  if (checkoutSlug) {
    context.lp_slug = checkoutSlug;
  }

  if (checkoutVariant) {
    context.lp_variant = checkoutVariant;
  }

  ATTRIBUTION_QUERY_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      context[key] = value;
    }
  });

  return context;
}

function withAttribution(
  parameters?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const attribution = getAttributionContext();
  const payload = {
    ...(parameters || {}),
    ...attribution,
  };

  return Object.keys(payload).length > 0 ? payload : undefined;
}

function canTrackMetaPixel(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function track(
  event: MetaPixelEvent,
  parameters?: Record<string, unknown>,
): void {
  if (!canTrackMetaPixel()) return;
  window.fbq?.("track", event, withAttribution(parameters));
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

/**
 * Server-side tracking for events (for better reliability, especially with redirects)
 * This complements client-side tracking with server-side Meta Conversions API
 */
async function trackEventServerSide(
  eventName: "Purchase" | "Contact" | "InitiateCheckout",
  params: {
    email?: string;
    phone?: string;
    value?: number;
    contentName?: string;
    contentType?: string;
    numItems?: number;
    checkoutMethod?: string;
  },
): Promise<boolean> {
  try {
    const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const response = await fetch("/api/pixel-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        pageUrl:
          typeof window !== "undefined" ? window.location.href : undefined,
        email: params.email,
        phone: params.phone,
        currency: CURRENCY.CODE,
        value: params.value,
        contentName: params.contentName,
        contentType: params.contentType,
        numItems: params.numItems,
        checkoutMethod: params.checkoutMethod,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Server-side pixel tracking failed:", error);
    return false;
  }
}

/**
 * Track purchase with both client-side and server-side events
 * Critical for WhatsApp orders where page redirects occur
 */
export async function trackPurchaseWithServerFallback(params: {
  items: CartItem[];
  orderValue: number;
  method: CheckoutMethod;
  customerEmail?: string;
  customerPhone?: string;
}): Promise<void> {
  const { items, orderValue, method, customerEmail, customerPhone } = params;

  if (items.length === 0) return;

  // Track client-side first
  trackPurchase({
    items,
    orderValue,
    method,
  });

  // Also track server-side for reliability
  await trackEventServerSide("Purchase", {
    email: customerEmail,
    phone: customerPhone,
    value: orderValue,
    contentType: "product",
    numItems: items.reduce((count, item) => count + item.quantity, 0),
    checkoutMethod: method,
  });
}

/**
 * Track customer contact/messaging events for WhatsApp
 * This tracks when customers initiate contact via WhatsApp
 */
export async function trackContact(params: {
  phone?: string;
  email?: string;
  checkoutMethod: "whatsapp" | "email";
}): Promise<void> {
  const { phone, email, checkoutMethod } = params;

  // Track client-side Contact event (if available)
  if (canTrackMetaPixel()) {
    window.fbq?.("track", "Contact", {
      ...withAttribution(),
      phone,
      email,
      checkout_method: checkoutMethod,
    });
  }

  // Track server-side
  await trackEventServerSide("Contact", {
    phone,
    email,
    checkoutMethod,
  });
}

/**
 * Delay function to ensure pixel fires before redirect
 * Use before redirecting to external URLs
 */
export function delayForPixel(milliseconds: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
