# Best Practices & Patterns Reference Guide

## Component Architecture Best Practices

### 1. Component Naming Convention

**Current:** Mix of descriptive and unclear names
**Standard to Follow:**

```typescript
// ✅ GOOD - Clear, descriptive, follows pattern
ProductCard.tsx; // Display component
ProductList.tsx; // Container component
AddToCartButton.tsx; // Specific action component
SearchInput.tsx; // Form component
Modal.tsx; // Layout component
CartProvider.tsx; // Context provider

// ❌ AVOID
comp.tsx; // Too vague
Item.tsx; // Ambiguous
View.tsx; // Unclear purpose
```

### 2. Component Organization

```typescript
// Good component structure:
"use client";  // 1. Directive if needed

// 2. Imports (grouped: react, external, internal)
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

// 3. Type definitions
interface ProductCardProps {
  product: Product;
  onSelect?: (id: number) => void;
}

// 4. Constants (only if component-specific)
const HOVER_DELAY = 300;

// 5. Component definition
export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // 6. Hooks
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // 7. Handlers
  const handleClick = () => {
    onSelect?.(product.id);
  };

  // 8. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}

// 9. Export (already default, but memoize if needed)
// export default memo(ProductCard);
```

---

## Hook Development Patterns

### 1. Hook Naming Convention

```typescript
// ✅ Always start with "use"
useCart(); // From context
useLocalStorage(); // Reusable logic
useMediaQuery(); // Query-based
useDebouncedValue(); // Value processing
useModal(); // UI state management

// ❌ AVOID
getCart(); // Not a hook pattern
fetchCart(); // Unclear
cartHook(); // Redundant
```

### 2. Hook Template

```typescript
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing [specific functionality]
 * @param initialValue - [what it does]
 * @returns [what it returns]
 */
export function useMyHook<T>(initialValue: T): [T, (value: T) => void] {
  // 1. State
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 2. Refs (for non-state data)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 3. Callbacks (memoized if used as dependency)
  const handleUpdate = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  // 4. Effects (grouped by concern)
  useEffect(() => {
    // Initialization
    return () => {
      // Cleanup
    };
  }, []);

  // 5. Handlers
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 6. Return (consistent shape)
  return [value, handleUpdate];
}
```

### 3. Context Hook Pattern

```typescript
import { createContext, ReactNode, useContext } from "react";

interface CartContextType {
  // Public API
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

// 1. Create context with null
const CartContext = createContext<CartContextType | null>(null);

// 2. Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Implementation
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 3. Custom hook for consumption
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
```

---

## Type Safety Patterns

### 1. Product Type Hierarchy

```typescript
// Base types
type ProductId = number & { readonly __brand: "ProductId" };
type ProductCategory = "Sarees" | "Kurtis" | "Salwar Kameez" | "Lehengas";

// Branded types for type safety
export const createProductId = (id: number): ProductId => id as ProductId;

// Proper interface
export interface Product {
  id: ProductId;
  name: string;
  category: ProductCategory;
  // ... rest of properties
}
```

### 2. Exhaustive Type Checking

```typescript
// ✅ GOOD - Exhaustive checking
type SortOption = "name" | "price-asc" | "price-desc";

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  switch (sortBy) {
    case "name":
      return products.sort((a, b) => a.name.localeCompare(b.name));
    case "price-asc":
      return products.sort((a, b) => a.price - b.price);
    case "price-desc":
      return products.sort((a, b) => b.price - a.price);
    // If you add a new type to SortOption, TypeScript will error here ✅
  }
}

// ❌ AVOID - Non-exhaustive
function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  if (sortBy === "name") {
    return products.sort((a, b) => a.name.localeCompare(b.name));
  }
  return products; // Silently handles unknown types ❌
}
```

### 3. Strict Type Definitions

```typescript
// ✅ GOOD - Strict types
interface CartItem {
  product: Product;
  quantity: number & { readonly __min: 1 }; // At least 1
  selectedSize?: ProductSize;
  selectedColor?: ProductColor;
}

// Create with validation
function createCartItem(
  product: Product,
  quantity: number,
  size?: string,
  color?: string,
): CartItem | Error {
  if (quantity < 1) return new Error("Quantity must be at least 1");
  return {
    product,
    quantity: quantity as CartItem["quantity"],
    selectedSize: size as ProductSize | undefined,
    selectedColor: color as ProductColor | undefined,
  };
}
```

---

## State Management Patterns

### 1. Derived State Pattern

```typescript
// ✅ GOOD - Compute derived values from source of truth
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Derived values - computed, not stored
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  // Never store cartCount or cartTotal in state!
}

// ❌ AVOID - Storing derived values
const [cartCount, setCartCount] = useState(0);
const [cartTotal, setCartTotal] = useState(0);

// When to update? Now you have to sync 3 pieces of state!
```

### 2. Effect Dependencies

```typescript
// ✅ GOOD - Explicit dependencies
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (isOpen) {
    document.addEventListener("keydown", handleEscape);
  }

  return () => {
    document.removeEventListener("keydown", handleEscape);
  };
}, [isOpen, onClose]); // All dependencies listed

// ❌ AVOID - Missing or overly broad dependencies
useEffect(() => {
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, []); // Will add listener once and never cleanup properly
```

### 3. Callback Memoization

```typescript
// ✅ GOOD - Memoize callbacks that are passed as dependencies
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => [...prev, { product, quantity: 1 }]);
  }, []); // No dependencies - safe

  const removeFromCart = useCallback(
    (productId: number) => {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    },
    [], // No dependencies
  );

  return { cart, addToCart, removeFromCart };
}

// Use in component that depends on it
useEffect(() => {
  // addToCart is stable, won't cause re-renders
}, [addToCart]);
```

---

## Error Handling Patterns

### 1. Try-Catch with Recovery

```typescript
// ✅ GOOD - Try with sensible fallback
function parsePrice(priceString: string): number {
  try {
    const parsed = parseInt(priceString.replace(/[₹,\s]/g, ""), 10);
    if (isNaN(parsed)) throw new Error(`Invalid price: ${priceString}`);
    return parsed;
  } catch (error) {
    console.error(`Failed to parse price: ${priceString}`, error);
    return 0; // Sensible default
  }
}

// ❌ AVOID - Silent failure
function parsePrice(priceString: string): number {
  try {
    return parseInt(priceString.replace(/[₹,\s]/g, ""), 10);
  } catch (error) {
    return 0; // User never knows something failed
  }
}
```

### 2. Error Boundaries

```typescript
// ✅ GOOD - Boundary with recovery UI
export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to external service
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Performance Optimization Patterns

### 1. Memoization Strategy

```typescript
// ✅ Use memo for expensive components
import { memo } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(
  ({ product }: ProductCardProps) => {
    return (
      <div>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.product.id === nextProps.product.id;
  }
);

export default ProductCard;
```

### 2. useMemo for Expensive Computations

```typescript
// ✅ GOOD - Expensive filter/sort operation
const filteredAndSorted = useMemo(() => {
  return products
    .filter((p) => p.category === category)
    .sort((a, b) => a.price - b.price);
}, [products, category]); // Only recompute if dependencies change

// ❌ AVOID - Lightweight operations
const doubled = useMemo(() => value * 2, [value]); // Overhead > benefit
```

### 3. Code Splitting

```typescript
// ✅ GOOD - Dynamic import for heavy components
import dynamic from "next/dynamic";

const ProductGallery = dynamic(() => import("@/components/ProductGallery"), {
  loading: () => <LoadingSkeleton />,
});

export default function ProductPage() {
  return (
    <div>
      <ProductGallery /> {/* Only loaded when needed */}
    </div>
  );
}
```

---

## Testing Patterns

### 1. Unit Test Structure

```typescript
describe("searchProducts", () => {
  // Arrange
  const mockProducts = [
    { id: 1, name: "Blue Saree", category: "Sarees" },
    { id: 2, name: "Yellow Kurta", category: "Kurtis" },
  ];

  // Act & Assert
  it("filters products by name", () => {
    const result = searchProducts(mockProducts, "saree");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("returns empty array for no matches", () => {
    const result = searchProducts(mockProducts, "xyz");
    expect(result).toHaveLength(0);
  });

  it("is case insensitive", () => {
    const result = searchProducts(mockProducts, "BLUE");
    expect(result).toHaveLength(1);
  });
});
```

### 2. Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("updates value", () => {
    const { result } = renderHook(() => useLocalStorage("test", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });
});
```

---

## Accessibility (A11y) Patterns

### 1. ARIA Labels

```typescript
// ✅ GOOD - Clear ARIA labels
<button
  onClick={handleRemoveFromCart}
  aria-label="Remove Blue Saree Size S from cart"
>
  <Trash2 className="w-5 h-5" />
</button>

// ❌ AVOID - Ambiguous labels
<button onClick={handleRemove} aria-label="Remove">
  <Trash2 />
</button>
```

### 2. Semantic HTML

```typescript
// ✅ GOOD - Semantic structure
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

<section>
  <h2>Featured Products</h2>
  <article>Product content</article>
</section>

// ❌ AVOID - Divs everywhere
<div className="nav">
  <div>
    <div className="link">
      <span onClick={() => navigate("/home")}>Home</span>
    </div>
  </div>
</div>
```

### 3. Keyboard Navigation

```typescript
// ✅ GOOD - Keyboard accessible
<input
  type="text"
  placeholder="Search products"
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") handleClose();
  }}
/>

// ❌ AVOID - Keyboard traps
<div
  onClick={handleClick}
  className="clickable"
  // No keyboard support!
>
  Click me
</div>
```

---

## Documentation Standards

### 1. JSDoc Format

```typescript
/**
 * Searches products by name, description, or category
 *
 * @param products - Array of products to search through
 * @param query - Search string (case-insensitive, trimmed)
 * @returns Array of matching products
 *
 * @example
 * const results = searchProducts(allProducts, "saree");
 * // Returns products matching "saree"
 */
export function searchProducts(products: Product[], query: string): Product[] {
  // Implementation
}
```

### 2. Component Documentation

```typescript
/**
 * ProductCard Component
 *
 * Displays a single product with image, name, price, and quick actions.
 * Includes wishlist and add-to-cart functionality.
 *
 * @component
 * @example
 * const product = { id: 1, name: "Saree", ... };
 * return <ProductCard product={product} />;
 */
interface ProductCardProps {
  /** Product object to display */
  product: Product;
  /** Optional callback when product is selected */
  onSelect?: (id: number) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // Component implementation
}
```

---

## File Organization Patterns

```
src/
├── components/
│   ├── common/           # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ErrorBoundary.tsx
│   ├── sections/         # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ProductGallery.tsx
│   │   └── Footer.tsx
│   ├── features/         # Feature-specific
│   │   ├── Cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   └── CartItem.tsx
│   │   └── Search/
│   │       ├── SearchModal.tsx
│   │       └── SearchInput.tsx
│   └── ProductCard.tsx   # Top-level if used everywhere
│
├── hooks/
│   ├── useCart.ts        # Business logic
│   ├── useModal.ts       # UI state
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── context/
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
│
├── types/
│   ├── product.ts
│   └── index.ts          # Re-export commonly used types
│
├── utils/
│   ├── helpers.ts        # Pure functions
│   └── validation.ts
│
├── lib/
│   ├── config.ts         # Configuration
│   ├── constants.ts      # Constants
│   └── analytics.ts      # Integrations
│
└── app/
    ├── page.tsx
    ├── layout.tsx
    ├── data/
    │   ├── products.ts
    │   └── constants.ts
    └── [category]/
        └── page.tsx
```

---

## Summary Checklist

- ✅ Use consistent naming conventions
- ✅ Keep components focused and single-purpose
- ✅ Memoize appropriately (not everywhere)
- ✅ Use TypeScript strictly
- ✅ Handle errors gracefully
- ✅ Include JSDoc comments
- ✅ Make components accessible
- ✅ Organize files by feature
- ✅ Create reusable hooks
- ✅ Test critical paths
