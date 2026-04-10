"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-secondary pt-72 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#efd6ad] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#5d4a30]">
            <Heart className="h-3.5 w-3.5" /> Saved Pieces
          </p>
          <h1 className="font-heading text-4xl text-[#153532] md:text-5xl">
            Your Wishlist
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#7a603c]">
            {wishlist.length} Product{wishlist.length === 1 ? "" : "s"}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-4xl border border-[#ead7bb] bg-white/80 p-10 text-center shadow-[0_14px_40px_rgba(44,36,22,0.08)]">
            <Heart className="mx-auto h-12 w-12 text-[#c5a06d]" />
            <h2 className="mt-5 text-3xl font-heading text-[#153532]">
              Your wishlist is empty
            </h2>
            <p className="mt-3 text-[#5d4a30]">
              Save your favorite looks here and come back when you&apos;re
              ready.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-flex rounded-full bg-[#153532] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#0f2725]"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.map(({ product }) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[1.75rem] border border-[#ead7bb] bg-white/90 shadow-[0_14px_40px_rgba(44,36,22,0.08)]"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-3/4 bg-[#f6efe5]">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </Link>

                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7a603c]">
                      {product.category}
                    </p>
                    <Link href={`/products/${product.id}`}>
                      <h2 className="mt-2 text-xl text-[#2c2416] transition-colors hover:text-[#5d4a30]">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-lg font-semibold text-[#153532]">
                      {product.price}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#153532] px-4 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#0f2725]"
                    >
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="inline-flex items-center justify-center rounded-full border border-[#d9c2a2] px-4 py-3 text-[#5d4a30] transition-colors hover:border-[#b88a53] hover:text-[#2c2416]"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
