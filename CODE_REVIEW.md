# Sansli By Zebin - Code Review & Improvement Recommendations

## Executive Summary

This is a well-structured Next.js 16 e-commerce application for luxury Indo-Western fashion. The code follows modern React patterns with good use of TypeScript, context API, and custom hooks. Below are strategic improvements across design, functionality, and readability.

---

## 🎨 DESIGN & ARCHITECTURE IMPROVEMENTS

### 1. **Add Configuration Management Layer**

**Current State:** Magic strings and magic numbers scattered across components
**Issue:** Hardcoded values like z-index (z-50, z-100, z-101), animations, and breakpoints make maintenance difficult

**Recommendations:**

```typescript
// Create: lib/config.ts
export const CONFIG = {
  zIndex: {
    HEADER: 50,
    MODAL_BACKDROP: 100,
    MODAL: 101,
  },
  animations: {
    HEADER_ENTRANCE: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    SCALE_ENTER: { duration: 1, delay: 0.2, ease: "easeOut" },
  },
  breakpoints: {
    MOBILE: 640,
    TABLET: 1024,
  },
  DEBOUNCE_DELAY: 300,
};
```

### 2. **Extract Component Composition Patterns**

**Current State:** State management and effects duplicated across CartDrawer and SearchModal
**Issue:** Both modals handle escape key, overflow prevention, animations identically

**Create:** `components/common/Modal.tsx`

```typescript
// Reusable modal wrapper handling:
// - Backdrop with blur
// - Escape key handling
// - Body overflow management
// - Animation variants
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
```

### 3. **Implement Compartmentalized Color/Style System**

**Current State:** Colors (bg-primary, text-accent) used directly in JSX
**Issue:** Hard to maintain consistency; difficult to implement dark mode or theme switching

**Create:** `lib/styles.ts`

```typescript
export const BUTTON_STYLES = {
  primary: "bg-primary text-white hover:bg-primary/90 transition-colors",
  secondary: "border border-gray-200 hover:border-primary",
  ghost: "hover:bg-gray-100",
} as const;

export const TYPOGRAPHY = {
  headingLarge: "font-heading text-5xl md:text-7xl font-medium",
  labelSmall: "text-xs tracking-[0.2em] uppercase",
} as const;
```

---

## 🔧 FUNCTIONALITY IMPROVEMENTS

### 4. **Cart Functionality Enhancements**

**Current Issues:**

- Size/color tracking in cart has logic flaws (removeFromCart only checks product ID, ignoring size/color)
- Price parsing duplicated in multiple places
- No validation for out-of-stock items

**Recommended Fixes:**

```typescript
// In CartContext.tsx - improve removeFromCart
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

// Extract price parsing to utility with validation
export function parsePriceStrict(priceString: string): number {
  const parsed = parseInt(priceString.replace(/[₹,\s]/g, ""), 10);
  if (isNaN(parsed)) throw new Error(`Invalid price: ${priceString}`);
  return parsed;
}
```

### 5. **Search Optimization**

**Current State:** Search computes results on every render
**Issue:** No debouncing; can be slow with large product catalogs

**Fix in SearchModal.tsx:**

```typescript
const [query, setQuery] = useState("");
const debouncedQuery = useDebouncedValue(query, 300); // Create custom hook
const results = useMemo(
  () => (debouncedQuery ? searchProducts(products, debouncedQuery) : products),
  [debouncedQuery],
);
```

### 6. **Add Product Availability Validation**

**Current State:** No stock checking before adding to cart
**Recommendation:**

```typescript
interface CartContextType {
  // ... existing
  canAddToCart: (productId: number) => boolean;
  getAvailableQuantity: (productId: number) => number;
}

// In addToCart:
const canAddToCart = (product: Product) => {
  return (
    product.inStock === true && (product.availableQuantity ?? Infinity) > 0
  );
};
```

### 7. **Implement Proper Error Boundaries**

**Current State:** No error handling for image failures, API errors
**Add:**

```typescript
// Create: components/common/ErrorBoundary.tsx
// Wrap main sections with error boundaries for graceful degradation
// Add fallbacks for image loading failures
```

### 8. **Add Analytics/Tracking**

**Create:** `lib/analytics.ts`

```typescript
export const trackEvent = (event: string, data?: Record<string, unknown>) => {
  // GA4, Mixpanel, or custom implementation
};

// Usage in components:
const handleAddToCart = (product: Product) => {
  trackEvent("add_to_cart", { product_id: product.id, price: product.price });
  addToCart(product);
};
```

---

## 📖 READABILITY & CODE QUALITY IMPROVEMENTS

### 9. **Create Constants for Magic Strings**

**Current Issues:**

- LocalStorage keys are hardcoded: `"sansli-cart"`, `"sansli-wishlist"`
- Product image paths duplicated
- Category slugs computed in multiple places

**Create:** `lib/constants.ts`

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
```

### 10. **Implement Proper Type Safety for Products**

**Current Issues:**

- Product interface is generic; hard to track required vs optional fields
- Price is always string (awkward for math operations)

**Improved Product Type:**

```typescript
export interface Product {
  id: number;
  name: string;
  price: {
    amount: number; // Always a number
    currency: "INR";
    formatted: string; // Cached formatted version
  };
  category: ProductCategory;
  description: string;
  images: ProductImage[];
  inventory: {
    inStock: boolean;
    quantity: number;
    reserved: number;
  };
  attributes?: {
    sizes?: string[];
    colors?: string[];
    material?: string;
  };
  featured?: boolean;
}
```

### 11. **Extract Complex Conditional Logic to Named Functions**

**Current Examples:**

**In ProductCard.tsx:**

```typescript
// ❌ Hard to read
className={`p-3 rounded-full shadow-sm transition-all duration-300 ${
  inWishlist
    ? "bg-accent text-white"
    : "bg-white text-primary hover:bg-primary hover:text-white"
}`}

// ✅ Better
const getWishlistButtonClasses = (inWishlist: boolean) =>
  cn(
    "p-3 rounded-full shadow-sm transition-all duration-300",
    inWishlist
      ? "bg-accent text-white"
      : "bg-white text-primary hover:bg-primary hover:text-white"
  );
```

### 12. **Consolidate Repeated Component Patterns**

**Current State:** Header, CartDrawer, SearchModal all have similar close/escape handling

**Create:** `hooks/useModal.ts`

```typescript
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
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
  };
}
```

---

## 🚀 PERFORMANCE IMPROVEMENTS

### 13. **Implement Image Optimization**

**Current State:** Using Next.js Image but no optimization strategy
**Add:**

```typescript
// Image optimization config in next.config.ts
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Use priority strategically
<Image priority /> // Only for above-the-fold images
```

### 14. **Memoization Strategy**

**Current Issues:**

- ProductCard component re-renders unnecessarily
- TrendingProducts slider re-renders on every parent update

**Add:**

```typescript
const ProductCard = memo(
  ({ product }: ProductCardProps) => {
    // ... component
  },
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  },
);
```

### 15. **Add SEO Metadata Per Page**

**Current State:** Only root metadata set
**Add to pages:**

```typescript
export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const product = products.find((p) => p.id === parseInt(params.id));
  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      images: product?.images[0],
    },
  };
};
```

---

## 📋 CODE ORGANIZATION IMPROVEMENTS

### 16. **Establish Clear File Structure**

**Current:**

```
├── app/data/          ← Good
├── components/        ← Needs subdivision
├── context/           ← Good
├── hooks/             ← Good
├── types/             ← Good
├── utils/             ← Good
└── public/
```

**Recommended additions:**

```
├── lib/
│   ├── config.ts
│   ├── constants.ts
│   ├── styles.ts
│   └── analytics.ts
├── components/
│   ├── common/        ← Reusable UI components
│   ├── sections/      ← Page sections
│   └── features/      ← Feature-specific components
├── __tests__/         ← Add tests
└── hooks/
    ├── useCart.ts
    ├── useModal.ts
    └── useDebouncedValue.ts
```

### 17. **Add JSDoc Comments to Exported Functions**

**Current:** Minimal documentation
**Example:**

```typescript
/**
 * Searches products by name, description, or category
 * @param products - Array of products to search
 * @param query - Search query (case-insensitive)
 * @returns Array of matching products
 */
export function searchProducts(products: Product[], query: string): Product[] {
  // ...
}
```

---

## 🧪 TESTING RECOMMENDATIONS

### 18. **Add Unit Tests**

```bash
# Install: npm install -D vitest @testing-library/react
# Create:
__tests__/
├── utils/helpers.test.ts
├── hooks/useLocalStorage.test.ts
└── components/ProductCard.test.tsx
```

**Example test:**

```typescript
describe("searchProducts", () => {
  it("filters products by name", () => {
    const results = searchProducts(mockProducts, "saree");
    expect(results).toHaveLength(2);
  });
});
```

### 19. **Add E2E Tests**

```bash
# Install: npm install -D playwright
# Test critical flows: add-to-cart, search, wishlist
```

---

## 🔒 SECURITY & BEST PRACTICES

### 20. **Add Input Validation**

**Current:** SearchModal doesn't validate/sanitize input

```typescript
export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[<>]/g, "").slice(0, 100);
}
```

### 21. **Environment Variables**

**Create:** `.env.local`

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 22. **Add Loading States & Skeletons**

**Current:** LoadingSkeleton component exists but isn't used
**Implement proper loading states:**

```typescript
// In TrendingProducts
const [isLoading, setIsLoading] = useState(false);
// Show LoadingSkeleton while loading
```

---

## PRIORITY IMPLEMENTATION ORDER

### Phase 1 (Critical - Week 1)

1. ✅ Create `lib/constants.ts` for all magic strings
2. ✅ Fix cart remove functionality (size/color bug)
3. ✅ Create `hooks/useModal.ts` to reduce duplication
4. ✅ Add proper TypeScript types for Product

### Phase 2 (Important - Week 2)

1. ✅ Create configuration system (zIndex, animations)
2. ✅ Extract button/typography styles
3. ✅ Add search debouncing
4. ✅ Implement error boundaries

### Phase 3 (Nice to have - Week 3)

1. ✅ Add image optimization config
2. ✅ Implement memoization
3. ✅ Add unit tests for utilities
4. ✅ Add analytics tracking

---

## SUMMARY OF KEY BENEFITS

| Improvement             | Benefit                                   | Impact |
| ----------------------- | ----------------------------------------- | ------ |
| Constants management    | Easier maintenance, fewer bugs            | High   |
| Type safety enhancement | Better IDE support, fewer runtime errors  | High   |
| Hook consolidation      | 30% less code, easier updates             | Medium |
| Error handling          | Better UX, easier debugging               | High   |
| Image optimization      | Faster load times, better Core Web Vitals | High   |
| Testing                 | Confidence in refactors, fewer bugs       | Medium |
| Code organization       | Easier onboarding, less cognitive load    | Medium |

---

## Next Steps

1. Review this document with team
2. Create roadmap for implementation
3. Start with Phase 1 improvements
4. Set up linting rules to enforce new patterns
5. Plan regular code review cycles// In TrendingProducts
const [isLoading, setIsLoading] = useState(false);
// Show LoadingSkeleton while loading

```

---

## PRIORITY IMPLEMENTATION ORDER

### Phase 1 (Critical - Week 1)

1. ✅ Create `lib/constants.ts` for all magic strings
2. ✅ Fix cart remove functionality (size/color bug)
3. ✅ Create `hooks/useModal.ts` to reduce duplication
4. ✅ Add proper TypeScript types for Product

### Phase 2 (Important - Week 2)

5. ✅ Create configuration system (zIndex, animations)
2. ✅ Extract button/typography styles
3. ✅ Add search debouncing
4. ✅ Implement error boundaries

### Phase 3 (Nice to have - Week 3)

9. ✅ Add image optimization config
2. ✅ Implement memoization
3. ✅ Add unit tests for utilities
4. ✅ Add analytics tracking

---

## SUMMARY OF KEY BENEFITS

| Improvement | Benefit | Impact |
|---|---|---|
| Constants management | Easier maintenance, fewer bugs | High |
| Type safety enhancement | Better IDE support, fewer runtime errors | High |
| Hook consolidation | 30% less code, easier updates | Medium |
| Error handling | Better UX, easier debugging | High |
| Image optimization | Faster load times, better Core Web Vitals | High |
| Testing | Confidence in refactors, fewer bugs | Medium |
| Code organization | Easier onboarding, less cognitive load | Medium |

---

## Next Steps

1. Review this document with team
2. Create roadmap for implementation
3. Start with Phase 1 improvements
4. Set up linting rules to enforce new patterns
5. Plan regular code review cycles
