# Implementation Guide - Quick Reference

This document provides concrete, copy-paste ready code for the most impactful improvements.

## 1. Create Configuration System

**File:** `lib/config.ts`

```typescript
export const CONFIG = {
  // Z-index layering
  zIndex: {
    HEADER: 50,
    MODAL_BACKDROP: 100,
    MODAL: 101,
  },

  // Animation configurations
  animations: {
    HEADER_ENTRANCE: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    } as const,
    SCALE_ENTER: {
      duration: 1,
      delay: 0.2,
      ease: "easeOut",
    } as const,
    SLIDE_UP: {
      duration: 0.3,
      ease: "easeOut",
    } as const,
  },

  // Timing
  delays: {
    DEBOUNCE_SEARCH: 300,
    STAGGER_ITEM: 0.1,
  },

  // Responsive breakpoints (in px)
  breakpoints: {
    MOBILE: 640,
    TABLET: 1024,
    DESKTOP: 1280,
  },
} as const;
```

---

## 2. Create Universal Modal Hook

**File:** `hooks/useModal.ts`

```typescript
import { useEffect, useState } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
```

**Usage in CartDrawer:**

```typescript
export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const modal = useModal(isOpen);

  useEffect(() => {
    if (isOpen) modal.open();
    else modal.close();
  }, [isOpen]);

  // Remove all the escape/overflow code - it's in the hook now
}
```

---

## 3. Create Debounced Value Hook

**File:** `hooks/useDebouncedValue.ts`

```typescript
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage in SearchModal:**

```typescript
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CONFIG } from "@/lib/config";

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(
    query,
    CONFIG.delays.DEBOUNCE_SEARCH,
  );

  const results = useMemo(
    () =>
      debouncedQuery ? searchProducts(products, debouncedQuery) : products,
    [debouncedQuery],
  );

  // ... rest of component
}
```

---

## 4. Fix Cart Context - Improve Remove Function

**File:** `context/CartContext.tsx` (Modified)

Replace the `removeFromCart` function:

```typescript
// OLD - Only checks product ID, loses track of size/color variants
const removeFromCart = (productId: number) => {
  setCart((prevCart) =>
    prevCart.filter((item) => item.product.id !== productId),
  );
};

// NEW - Properly handles variants
const removeFromCart = (productId: number, size?: string, color?: string) => {
  setCart((prevCart) =>
    prevCart.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ),
    ),
  );
};
```

Also update the context type:

```typescript
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: number, size?: string, color?: string) => void; // UPDATED
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}
```

---

## 5. Create Constants File

**File:** `lib/constants.ts`

```typescript
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
  SYMBOL: "₹",
  CODE: "INR",
  LOCALE: "en-IN",
} as const;

export const SELECTORS = {
  CARTCOUNT_BADGE: "cart-count-badge",
  PRODUCT_IMAGE: "product-image",
} as const;

export const MESSAGES = {
  CART_EMPTY: "Your cart is empty",
  CART_EMPTY_CTA: "Add some items to get started!",
  NO_RESULTS: "No products found",
  EMAIL_INVALID: "Please enter a valid email address",
  SUBSCRIPTION_SUCCESS: "Thank you for subscribing!",
} as const;
```

**Update useLocalStorage to use constants:**

```typescript
// In CartContext.tsx
const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);

// In WishlistContext.tsx
const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>(
  STORAGE_KEYS.WISHLIST,
  [],
);
```

---

## 6. Create Utility for Price Parsing (Enhanced)

**File:** `utils/helpers.ts` (Add these functions)

```typescript
/**
 * Strictly parse price string to number with validation
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
 * Safely parse price with fallback
 */
export function parsePriceSafe(
  priceString: string,
  fallback: number = 0,
): number {
  try {
    return parsePriceStrict(priceString);
  } catch {
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
```

**Update CartContext to use strict parsing:**

```typescript
const cartTotal = cart.reduce((total, item) => {
  try {
    const price = parsePriceStrict(item.product.price);
    return total + price * item.quantity;
  } catch (error) {
    console.error(`Failed to calculate total for ${item.product.name}`, error);
    return total;
  }
}, 0);
```

---

## 7. Create Reusable Modal Component

**File:** `components/common/Modal.tsx`

```typescript
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { CONFIG } from "@/lib/config";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  position?: "center" | "right";
  closeOnBackdropClick?: boolean;
}

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  position = "center",
  closeOnBackdropClick = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: CONFIG.zIndex.MODAL_BACKDROP }}
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: position === "right" ? "100%" : 0,
              y: position === "center" ? -50 : 0,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x: position === "right" ? "100%" : 0,
              y: position === "center" ? -50 : 0,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed ${
              position === "right"
                ? "top-0 right-0 h-full"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg"
            } bg-white shadow-2xl ${SIZE_MAP[size]}`}
            style={{ zIndex: CONFIG.zIndex.MODAL }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 8. Enhanced Product Type

**File:** `types/product.ts` (Updated)

```typescript
export type ProductCategory =
  | "Salwar Kameez"
  | "Sarees"
  | "Kurtis"
  | "Gowns"
  | "Lehengas"
  | "Modest Wear"
  | "Fusion";

export interface ProductPrice {
  amount: number;
  currency: "INR";
  formatted: string;
}

export interface ProductInventory {
  inStock: boolean;
  quantity: number;
  reserved: number;
}

export interface Product {
  id: number;
  name: string;
  price: ProductPrice;
  category: ProductCategory;
  description: string;
  images: string[];
  attributes?: {
    sizes?: string[];
    colors?: string[];
    material?: string;
  };
  inventory: ProductInventory;
  featured?: boolean;
  createdAt?: Date;
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
  category?: ProductCategory;
  priceRange?: [number, number];
  inStock?: boolean;
  sortBy?: "name" | "price-asc" | "price-desc" | "newest";
}
```

---

## 9. Create Error Boundary Component

**File:** `components/common/ErrorBoundary.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-red-900 font-bold mb-2">Something went wrong</h2>
            <p className="text-red-700 text-sm">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 10. Quick Migration Checklist

### Update imports across components

```bash
# Search and replace patterns:
1. "sansli-cart" → STORAGE_KEYS.CART
2. "sansli-wishlist" → STORAGE_KEYS.WISHLIST
3. parsePrice → parsePriceStrict (or parsePriceSafe)
4. Escape key handling → useModal hook
5. z-50 → CONFIG.zIndex.HEADER (etc.)
```

### Component Updates Priority

1. ✅ CartContext.tsx - Fix removeFromCart
2. ✅ SearchModal.tsx - Add debouncing
3. ✅ CartDrawer.tsx - Use useModal hook
4. ✅ Header.tsx - Use useModal hook
5. ✅ All components - Use CONFIG instead of magic values

---

## Files to Create (In Order)

```bash
lib/config.ts                    # Configuration constants
lib/constants.ts                 # App constants & messages
hooks/useModal.ts                # Modal logic extraction
hooks/useDebouncedValue.ts       # Debounce utility
components/common/Modal.tsx      # Reusable modal wrapper
components/common/ErrorBoundary.tsx
types/product.ts                 # Enhanced types
```

---
