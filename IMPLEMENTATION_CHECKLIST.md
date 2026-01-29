# 📋 Quick Reference Checklist - Implementation Tasks

## Phase 1: Critical Bug Fixes (4 hours) - 🔴 HIGH PRIORITY

### Task 1.1: Fix Cart Remove Function

- **Time:** 10 minutes
- **Files:** `context/CartContext.tsx`
- **Changes:**
  - [ ] Update `removeFromCart` signature to include size/color params
  - [ ] Update filter logic to check size/color as well as ID
  - [ ] Update interface type definition
  - [ ] Test: Add same product with different sizes, remove one
- **Reference:** IMPLEMENTATION_GUIDE.md section 4
- **Validation:** Try removing only one size variant, others stay

### Task 1.2: Create useModal Hook

- **Time:** 15 minutes
- **Files to Create:** `hooks/useModal.ts`
- **Changes:**
  - [ ] Create new hook file
  - [ ] Copy-paste code from IMPLEMENTATION_GUIDE.md section 2
  - [ ] Update CartDrawer.tsx to use hook
  - [ ] Update SearchModal.tsx to use hook
  - [ ] Remove duplicate useEffect code from both components
- **Reference:** IMPLEMENTATION_GUIDE.md section 2
- **Validation:** Escape key closes modals, overflow hidden/restored

### Task 1.3: Improve Price Parsing

- **Time:** 20 minutes
- **Files:** `utils/helpers.ts`, `context/CartContext.tsx`
- **Changes:**
  - [ ] Add `parsePriceStrict` function with validation
  - [ ] Add `parsePriceSafe` function with fallback
  - [ ] Add `isValidPrice` function
  - [ ] Update CartContext to use strict parsing
  - [ ] Add error handling in cartTotal calculation
- **Reference:** IMPLEMENTATION_GUIDE.md section 6
- **Validation:** Invalid prices don't crash app, console error logged

### Task 1.4: Create Constants File

- **Time:** 15 minutes
- **Files to Create:** `lib/constants.ts`
- **Changes:**
  - [ ] Create constants file with storage keys
  - [ ] Add product image constants
  - [ ] Add currency constants
  - [ ] Add message constants
  - [ ] Update all imports in:
    - [ ] CartContext.tsx
    - [ ] WishlistContext.tsx
    - [ ] Footer.tsx
    - [ ] CartDrawer.tsx
- **Reference:** IMPLEMENTATION_GUIDE.md section 5
- **Validation:** No hardcoded "sansli-cart" or message strings

---

## Phase 2: Architecture Improvements (8 hours) - 🟠 MEDIUM PRIORITY

### Task 2.1: Create Configuration System

- **Time:** 20 minutes
- **Files to Create:** `lib/config.ts`
- **Changes:**
  - [ ] Create config file with all constants
  - [ ] Add zIndex values
  - [ ] Add animation configurations
  - [ ] Add breakpoints
  - [ ] Add timing values
  - [ ] Update imports in:
    - [ ] Header.tsx (z-50 → CONFIG.zIndex.HEADER)
    - [ ] CartDrawer.tsx (z-100, z-101)
    - [ ] All animation components
- **Reference:** IMPLEMENTATION_GUIDE.md section 1
- **Validation:** No more hardcoded z-50, duration: 0.6, etc.

### Task 2.2: Create Debounced Value Hook

- **Time:** 10 minutes
- **Files to Create:** `hooks/useDebouncedValue.ts`
- **Changes:**
  - [ ] Create hook file
  - [ ] Copy-paste code from IMPLEMENTATION_GUIDE.md
  - [ ] Update SearchModal.tsx to import and use
  - [ ] Add useMemo for results computation
  - [ ] Test search performance
- **Reference:** IMPLEMENTATION_GUIDE.md section 3
- **Validation:** Search results don't update on every keystroke

### Task 2.3: Add Stock Validation to Cart

- **Time:** 20 minutes
- **Files:** `context/CartContext.ts`
- **Changes:**
  - [ ] Add stock checking to `addToCart`
  - [ ] Return error or boolean from addToCart
  - [ ] Update type definitions
  - [ ] Show user message if out of stock
  - [ ] Disable add-to-cart button for out of stock items
- **Reference:** BUG_REPORT.md #5
- **Validation:** Can't add out-of-stock items to cart

### Task 2.4: Create Reusable Modal Component

- **Time:** 25 minutes
- **Files to Create:** `components/common/Modal.tsx`
- **Changes:**
  - [ ] Create Modal component
  - [ ] Copy-paste from IMPLEMENTATION_GUIDE.md
  - [ ] Optionally refactor CartDrawer to use it
  - [ ] Optionally refactor SearchModal to use it
- **Reference:** IMPLEMENTATION_GUIDE.md section 7
- **Validation:** Component renders correctly, accepts children

### Task 2.5: Add Image Error Handling

- **Time:** 15 minutes
- **Files:** `components/ProductCard.tsx`, `components/CategoriesSection.tsx`
- **Changes:**
  - [ ] Add onError callback to Image components
  - [ ] Show placeholder on error
  - [ ] Log image loading errors
  - [ ] Test with invalid image URL
- **Reference:** BUG_REPORT.md #6
- **Validation:** Broken images don't break layout

### Task 2.6: Create Error Boundary Component

- **Time:** 20 minutes
- **Files to Create:** `components/common/ErrorBoundary.tsx`
- **Changes:**
  - [ ] Create ErrorBoundary class component
  - [ ] Copy-paste from IMPLEMENTATION_GUIDE.md
  - [ ] Wrap main sections with ErrorBoundary
  - [ ] Test error handling
- **Reference:** IMPLEMENTATION_GUIDE.md section 9
- **Validation:** Component catches and displays errors gracefully

---

## Phase 3: Code Quality & Testing (6 hours) - 🟡 POLISH

### Task 3.1: Enhanced Product Types

- **Time:** 30 minutes
- **Files:** `types/product.ts`
- **Changes:**
  - [ ] Update Product interface with new structure
  - [ ] Add ProductPrice interface
  - [ ] Add ProductInventory interface
  - [ ] Update all product usages throughout codebase
  - [ ] Update product data in products.ts
- **Reference:** IMPLEMENTATION_GUIDE.md section 8
- **Validation:** Price is now object with amount, currency, formatted

### Task 3.2: Add Loading States

- **Time:** 20 minutes
- **Files:** Components using LoadingSkeleton
- **Changes:**
  - [ ] Add isLoading state to components
  - [ ] Show LoadingSkeleton while loading
  - [ ] Test with network throttling
- **Reference:** BUG_REPORT.md #14
- **Validation:** Skeleton shows before products load

### Task 3.3: Add JSDoc Comments

- **Time:** 30 minutes
- **Files:** All utility functions and exports
- **Changes:**
  - [ ] Add JSDoc to searchProducts
  - [ ] Add JSDoc to formatCurrency
  - [ ] Add JSDoc to parsePrice functions
  - [ ] Add JSDoc to all custom hooks
  - [ ] Add JSDoc to context providers
- **Reference:** BEST_PRACTICES.md documentation section
- **Validation:** All exported functions have JSDoc

### Task 3.4: Improve ARIA Labels

- **Time:** 25 minutes
- **Files:** Components with buttons/interactions
- **Changes:**
  - [ ] Add aria-label to wishlist buttons
  - [ ] Add aria-label to cart buttons
  - [ ] Add aria-label to close buttons
  - [ ] Add aria-label to navigation links
  - [ ] Test with screen reader
- **Reference:** BUG_REPORT.md #10
- **Validation:** All interactive elements have proper labels

### Task 3.5: Add Unit Tests

- **Time:** 45 minutes
- **Files to Create:** `__tests__/utils/helpers.test.ts`
- **Changes:**
  - [ ] Install testing library if needed
  - [ ] Create test file
  - [ ] Test searchProducts function
  - [ ] Test parsePrice functions
  - [ ] Test sortProducts function
  - [ ] Test formatCurrency function
- **Reference:** BEST_PRACTICES.md testing section
- **Validation:** All utility tests pass

### Task 3.6: Update Tailwind/ESLint Config

- **Time:** 15 minutes
- **Files:** `eslint.config.mjs`, `tailwind.config.ts`
- **Changes:**
  - [ ] Add ESLint rule for no hardcoded strings
  - [ ] Add Tailwind theme values for z-index
  - [ ] Add Tailwind animation presets
  - [ ] Document color scheme
- **Reference:** Create project config files
- **Validation:** Linter catches issues, colors consistent

---

## 📊 Progress Tracking

### Phase 1 (Critical - Due: End of Week)

- [ ] Task 1.1: Fix Cart Remove (10 min)
- [ ] Task 1.2: Create useModal Hook (15 min)
- [ ] Task 1.3: Improve Price Parsing (20 min)
- [ ] Task 1.4: Create Constants File (15 min)
- **Total Time:** 60 minutes
- **Status:** Not Started [ ] In Progress [ ] Complete [ ]

### Phase 2 (Architecture - Due: End of Month)

- [ ] Task 2.1: Create Config System (20 min)
- [ ] Task 2.2: Create Debounce Hook (10 min)
- [ ] Task 2.3: Add Stock Validation (20 min)
- [ ] Task 2.4: Create Modal Component (25 min)
- [ ] Task 2.5: Add Image Error Handling (15 min)
- [ ] Task 2.6: Create Error Boundary (20 min)
- **Total Time:** 110 minutes
- **Status:** Not Started [ ] In Progress [ ] Complete [ ]

### Phase 3 (Polish - Due: End of Month)

- [ ] Task 3.1: Enhanced Types (30 min)
- [ ] Task 3.2: Add Loading States (20 min)
- [ ] Task 3.3: Add JSDoc (30 min)
- [ ] Task 3.4: Improve ARIA (25 min)
- [ ] Task 3.5: Add Unit Tests (45 min)
- [ ] Task 3.6: Update Configs (15 min)
- **Total Time:** 165 minutes
- **Status:** Not Started [ ] In Progress [ ] Complete [ ]

---

## 🧪 Testing Checklist

### After Each Task, Verify

#### Functionality

- [ ] Feature works as intended
- [ ] No console errors
- [ ] No console warnings
- [ ] No TypeScript errors

#### Code Quality

- [ ] No duplication with other code
- [ ] Follows BEST_PRACTICES.md patterns
- [ ] Functions have JSDoc comments
- [ ] Types are properly defined

#### Performance

- [ ] No unnecessary re-renders (React DevTools)
- [ ] Network tab shows expected requests
- [ ] Loading states work correctly
- [ ] Debouncing/memoization effective

#### User Experience

- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Touch interactions work
- [ ] Error messages clear

#### Accessibility

- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Color contrast adequate

---

## 🚀 Deployment Checklist

### Before Deploying After Phase 1

- [ ] All 3 critical bugs fixed
- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Test in browser:
  - [ ] Cart operations work
  - [ ] Remove items by size/color
  - [ ] Search modal opens/closes
  - [ ] Escape key works
- [ ] Check for console errors/warnings
- [ ] Verify localStorage works

### Before Deploying After Phase 2

- [ ] All architecture improvements complete
- [ ] Run all tests: `npm test`
- [ ] Performance audit with Lighthouse
- [ ] Test on mobile device
- [ ] Check loading states work
- [ ] Error boundary catches errors

### Before Deploying After Phase 3

- [ ] Unit tests passing
- [ ] ESLint passing with 0 errors
- [ ] TypeScript with 0 errors
- [ ] Full accessibility audit
- [ ] Performance optimized
- [ ] Documentation complete

---

## 🔗 Quick Reference Links

**Documents:**

- CODE_REVIEW.md - Main review document
- BUG_REPORT.md - Detailed bug list
- IMPLEMENTATION_GUIDE.md - Code examples
- BEST_PRACTICES.md - Reference patterns

**Key Files to Modify:**

- context/CartContext.tsx
- context/WishlistContext.tsx
- components/CartDrawer.tsx
- components/SearchModal.tsx
- components/Header.tsx
- types/product.ts
- utils/helpers.ts

**Files to Create:**

- lib/config.ts
- lib/constants.ts
- hooks/useModal.ts
- hooks/useDebouncedValue.ts
- components/common/Modal.tsx
- components/common/ErrorBoundary.tsx

---

## 📝 Notes Section

Use this space to track progress:

```
Week 1:
- Started Phase 1 on: _______
- Completed Task 1.1 on: _______
- Completed Task 1.2 on: _______
- Completed Task 1.3 on: _______
- Completed Task 1.4 on: _______
- Total time spent: _______

Issues encountered:
-
-
-

Week 2:
- Started Phase 2 on: _______
- Completed Task 2.1 on: _______
- [continue...]

```

---

**Last Updated:** January 27, 2026
**Total Estimated Time:** 20-25 hours
**Recommended Pace:** 5-7 hours per week over 3-4 weeks
