"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { CartItem, Product } from "@/types/product";
import { parsePriceSafe } from "@/utils/helpers";
import { createContext, ReactNode, useContext } from "react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);

  const addToCart = (product: Product, size?: string, color?: string) => {
    setCart((prevCart) => {
      // Check if product already exists in cart with same size/color
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color,
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item
        return [
          ...prevCart,
          { product, quantity: 1, selectedSize: size, selectedColor: color },
        ];
      }
    });
  };

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

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    try {
      const price = parsePriceSafe(item.product.price, 0);
      return total + price * item.quantity;
    } catch (error) {
      console.error(
        `Failed to calculate total for ${item.product.name}`,
        error,
      );
      return total;
    }
  }, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
