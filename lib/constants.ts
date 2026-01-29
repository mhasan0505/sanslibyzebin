export const STORAGE_KEYS = {
  CART: "sansli-cart",
  WISHLIST: "sansli-wishlist",
  USER_PREFERENCES: "sansli-preferences",
} as const;

export const PRODUCT_IMAGES = {
  PLACEHOLDER: "/placeholder.png",
  LOGO: "/Logo.webp",
} as const;

export const CURRENCY = {
  SYMBOL: "৳",
  CODE: "BDT",
  LOCALE: "bn-BD",
} as const;

export const MESSAGES = {
  CART_EMPTY: "Your cart is empty",
  CART_EMPTY_CTA: "Add some items to get started!",
  NO_RESULTS: "No products found",
  EMAIL_INVALID: "Please enter a valid email address",
  SUBSCRIPTION_SUCCESS: "Thank you for subscribing!",
} as const;
