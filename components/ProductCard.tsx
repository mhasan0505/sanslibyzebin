"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group">
      <Link href={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square mb-6">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleToggleWishlist}
              className={`p-3 transition-all duration-300 ${
                inWishlist
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-900 hover:text-white"
              }`}
              aria-label={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <p className="text-xs text-gray-500 tracking-widest uppercase mb-2">
          {product.category}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg text-gray-900 group-hover:text-gray-600 transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-semibold text-gray-900">{product.price}</p>
      </div>
    </div>
  );
}
