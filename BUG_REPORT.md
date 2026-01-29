# Bug Reports & Specific Issues Found

## 🐛 CRITICAL BUGS

### 1. Cart Remove Function Loses Size/Color Context

**Location:** [context/CartContext.tsx](context/CartContext.tsx#L43)
**Severity:** HIGH
**Description:**
The `removeFromCart` function only checks product ID, ignoring size and color selections.

```typescript
// Current (BUGGY):
const removeFromCart = (productId: number) => {
  setCart((prevCart) =>
    prevCart.filter((item) => item.product.id !== productId),
  );
};
```

**Problem:**
If a user adds the same product with different sizes/colors, removing one removes ALL variants.

**Example Scenario:**

1. Add Blue Saree (Size S) to cart
2. Add Blue Saree (Size M) to cart
3. Click remove on Size S
4. **Expected:** Only Size S removed
5. **Actual:** BOTH removed! ❌

**Fix:** See IMPLEMENTATION_GUIDE.md section 4

---

### 2. Inconsistent Price Format Handling

**Location:** Multiple files
**Severity:** HIGH
**Description:**
Price is stored as string `"₹ 45,000"` and parsed repeatedly in different ways.

**Issues:**

- CartContext.tsx line 71: `parseInt(item.product.price.replace(/[₹,\s]/g, ""), 10)`
- No error handling if price format is invalid
- Parsing logic duplicated in multiple places

**Risk:** If product has invalid price format (e.g., "Price TBD"), cart crashes.

**Fix:** See IMPLEMENTATION_GUIDE.md section 6

---

### 3. Escape Key Handler Has Memory Leak Risk

**Location:** [components/CartDrawer.tsx](components/CartDrawer.tsx#L18), [components/SearchModal.tsx](components/SearchModal.tsx#L25)
**Severity:** MEDIUM
**Description:**
Event listeners added to document but removed with `onClose` callback.

```typescript
return () => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "unset";
};
```

**Problem:** If `onClose` dependency changes, old listeners persist. This code is duplicated in 2+ components.

**Fix:** Consolidate into `useModal` hook. See IMPLEMENTATION_GUIDE.md section 2

---

## ⚠️ MEDIUM PRIORITY ISSUES

### 4. SearchModal Doesn't Debounce

**Location:** [components/SearchModal.tsx](components/SearchModal.tsx#L18)
**Severity:** MEDIUM
**Description:**
Search results recalculate on every keystroke with no debouncing.

```typescript
const results = query ? searchProducts(products, query) : products;
```

**Impact:**

- Renders happening too frequently
- Performance issues with large product catalogs
- Doesn't match user expectations (usually search waits 300ms)

**Fix:** See IMPLEMENTATION_GUIDE.md section 3

---

### 5. No Validation for Product Stock

**Location:** [context/CartContext.tsx](context/CartContext.tsx#L28)
**Severity:** MEDIUM
**Description:**
Users can add out-of-stock items to cart.

```typescript
const addToCart = (product: Product, size?: string, color?: string) => {
  // No check for product.inStock or inventory
};
```

**Expected Behavior:**

- Should prevent adding out-of-stock products
- Show user-friendly message
- Disable add-to-cart button on out-of-stock items

---

### 6. Image Fallback Missing

**Location:** [components/ProductCard.tsx](components/ProductCard.tsx#L36), [components/CategoriesSection.tsx](components/CategoriesSection.tsx#L24)
**Severity:** MEDIUM
**Description:**
No error handling if product image fails to load.

**Current:**

```tsx
<Image
  src={product.images[0]}
  alt={product.name}
  fill
  className="object-cover group-hover:scale-105"
/>
// If image doesn't exist or 404, nothing handles it
```

**Fix:** Add Image error callback and fallback image

---

### 7. Type Inconsistency: Price

**Location:** [types/product.ts](types/product.ts)
**Severity:** MEDIUM
**Description:**
Price is string, but mathematically it's a number. Creates unnecessary conversions.

**Current:**

```typescript
interface Product {
  price: string; // "₹ 45,000"
}
```

**Better:**

```typescript
interface Product {
  price: {
    amount: number;
    currency: "INR";
    formatted: string;
  };
}
```

---

### 8. Hardcoded Z-Index Values

**Location:** Multiple components
**Severity:** LOW-MEDIUM
**Description:**
Z-index values scattered throughout codebase: `z-50`, `z-100`, `z-101`

```typescript
// Header
className={`fixed top-0 left-0 right-0 z-50 transition-all`}

// CartDrawer
className="fixed inset-0 bg-black/60 z-100"
className="fixed top-0 right-0 h-full w-full z-101"
```

**Issues:**

- Hard to maintain z-index hierarchy
- Easy to accidentally create stacking conflicts
- No single source of truth

**Fix:** Move to CONFIG. See IMPLEMENTATION_GUIDE.md section 1

---

### 9. No Error Handling for LocalStorage

**Location:** [hooks/useLocalStorage.ts](hooks/useLocalStorage.ts#L15)
**Severity:** MEDIUM
**Description:**
While there's try-catch, no user feedback on storage failures.

```typescript
catch (error) {
  console.warn(`Error reading localStorage key "${key}":`, error);
  return initialValue;
}
```

**Problem:**

- Silent failures - user doesn't know data won't persist
- No logging to external service
- No user notification

**Recommendation:**

```typescript
catch (error) {
  console.error(`Storage error for key "${key}":`, error);
  // Could emit analytics event or show toast notification
}
```

---

### 10. Missing Accessibility Attributes

**Location:** [components/ProductCard.tsx](components/ProductCard.tsx), [components/Header.tsx](components/Header.tsx)
**Severity:** MEDIUM
**Description:**
Some buttons lack proper ARIA labels or semantic meaning.

**Good Examples:**

```tsx
aria-label="Add to wishlist"
aria-label="Remove from wishlist"
```

**Missing in:**

- Product gallery overlays
- Mobile menu in Header (partial)
- Sort/filter options (when added)

---

## 🔍 CODE QUALITY ISSUES

### 11. Magic Strings Throughout Codebase

**Location:** All context files and components
**Severity:** LOW
**Description:**
Hardcoded strings not centralized.

**Examples:**

- "sansli-cart"
- "sansli-wishlist"
- "Your cart is empty"
- "Add some items to get started!"

**Fix:** Create `lib/constants.ts`. See IMPLEMENTATION_GUIDE.md section 5

---

### 12. Repeated Modal Logic

**Location:** CartDrawer.tsx, SearchModal.tsx
**Severity:** LOW
**Description:**
Both implement nearly identical escape key + overflow handling.

**Lines of duplication:**

```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
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
}, [isOpen, onClose]);
```

**DRY Violation:** This exact pattern appears in 2 places.

**Fix:** Extract into `useModal` hook. See IMPLEMENTATION_GUIDE.md section 2

---

### 13. Animation Values Scattered

**Location:** [components/Header.tsx](components/Header.tsx#L28), [components/HeroSection.tsx](components/HeroSection.tsx#L13)
**Severity:** LOW
**Description:**
Animation configs are hardcoded in components.

```typescript
// In Header.tsx
<motion.header
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
/>

// In HeroSection.tsx - different config for similar component
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
/>
```

**Impact:**

- Inconsistent animation feel across app
- Hard to update all animations at once
- No design system for motion

**Fix:** Move to CONFIG. See IMPLEMENTATION_GUIDE.md section 1

---

### 14. No Loading States

**Location:** All async components
**Severity:** LOW
**Description:**
LoadingSkeleton component exists but isn't used anywhere.

**Current Code:**

```tsx
export default function TrendingProducts() {
  // No loading state
  const sliderRef = useRef<Slider>(null);
  // Always renders products immediately
}
```

**Issue:** If products were fetched from API, users see nothing while loading.

**Recommendation:**

```typescript
const [isLoading, setIsLoading] = useState(false);

// Show LoadingSkeleton during loading
// Show ErrorBoundary if fetch fails
```

---

### 15. Product Image Paths Inconsistent

**Location:** [app/data/products.ts](app/data/products.ts)
**Severity:** LOW
**Description:**
Images paths inconsistent format between products.

```typescript
// Good - clear naming
images: ["/image01_yellow.png", "/image02_yellow.png"];

// But then:
images: ["/image03_blue.png", "/image04_blue.png"];
```

**Issue:** Hard to know what images exist, causes 404s.

**Better Approach:**

```typescript
export const PRODUCT_IMAGES = {
  YELLOW_SET_1: "/products/yellow/image01.webp",
  YELLOW_SET_2: "/products/yellow/image02.webp",
} as const;

// Then use:
images: [PRODUCT_IMAGES.YELLOW_SET_1, PRODUCT_IMAGES.YELLOW_SET_2];
```

---

## 🚨 CONFIGURATION ISSUES

### 16. No Environment Variables

**Location:** Root
**Severity:** LOW
**Description:**
No `.env.local` file for configuration.

**Should Include:**

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_SITE_URL=
```

---

### 17. No ESLint Rules Enforcing Patterns

**Location:** [eslint.config.mjs](eslint.config.mjs)
**Severity:** LOW
**Description:**
ESLint exists but might not enforce consistency.

**Should Add:**

```javascript
// Warn on TODO comments left in code
// Enforce no magic numbers/strings
// Warn on unused variables
// Enforce TypeScript best practices
```

---

## SUMMARY BY CATEGORY

| Category         | Count | Examples                                             |
| ---------------- | ----- | ---------------------------------------------------- |
| 🔴 Critical Bugs | 3     | Cart remove, price parsing, escape listener leak     |
| 🟠 Medium Issues | 7     | No debounce, no stock validation, type inconsistency |
| 🟡 Code Quality  | 5     | Magic strings, duplication, animation values         |
| 🟢 Low Priority  | 3     | Missing loading states, env config                   |

---

## FIX PRIORITY ROADMAP

### This Week (Fix These First)

1. ✅ Fix cart remove function (Bug #1)
2. ✅ Extract useModal hook (Issue #3, #12)
3. ✅ Create constants file (Issue #11)
4. ✅ Improve price parsing (Bug #2)

### Next Week

5. ✅ Add search debouncing (Bug #4)
6. ✅ Add stock validation (Issue #5)
7. ✅ Create CONFIG system (Issues #8, #13)
8. ✅ Add error boundaries (Issue #6)

### Following Week

9. ✅ Improve product types (Issue #7)
10. ✅ Add loading states (Issue #14)
11. ✅ Add error handling (Issue #9)
12. ✅ Improve accessibility (Issue #10)

---
