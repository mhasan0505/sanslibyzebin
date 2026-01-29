"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Product, WishlistItem } from "@/types/product";
import { createContext, ReactNode, useContext } from "react";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>(
    STORAGE_KEYS.WISHLIST,
    [],
  );

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      // Check if product already exists
      const exists = prevWishlist.some(
        (item) => item.product.id === product.id,
      );
      if (exists) {
        return prevWishlist;
      }
      return [...prevWishlist, { product, addedAt: new Date() }];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.product.id !== productId),
    );
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = wishlist.length;

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
