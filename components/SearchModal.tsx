"use client";

import { products } from "@/app/data/products";
import { useModal } from "@/hooks/useModal";
import { searchProducts } from "@/utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const modal = useModal(isOpen);

  // Compute results directly from query - no useEffect needed
  const results = query ? searchProducts(products, query) : products;

  useEffect(() => {
    if (isOpen) {
      modal.open();
    } else {
      modal.close();
    }
  }, [isOpen, modal]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#2c2416]/35 backdrop-blur-sm z-100 flex items-start justify-center pt-16 sm:pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-[#fffdf8] shadow-2xl w-full max-w-2xl mx-4 max-h-[78vh] overflow-hidden rounded-2xl border border-[#efd6ad]/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-5 sm:p-6 border-b border-[#efd6ad]/40 bg-linear-to-r from-[#fff7ea] via-[#fef9f3] to-[#fff7ea]">
            <div className="relative flex items-center bg-white/70 rounded-full border border-[#efd6ad]/60 shadow-[0_6px_20px_rgba(239,214,173,0.25)] focus-within:ring-2 focus-within:ring-[#d4b892]">
              <Search className="absolute left-4 w-4.5 h-4.5 text-[#8b6f47]/70 pointer-events-none" />
              <input
                type="text"
                placeholder="Search sarees, co-ords, boutique picks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-transparent text-[#2c2416] text-sm sm:text-base focus:outline-none placeholder-[#8b6f47]/50"
                autoFocus
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 text-[#8b6f47]/60 hover:text-[#2c2416] transition-colors p-2 rounded-full hover:bg-[#efd6ad]/30"
                aria-label="Close search modal"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-[#8b6f47]/60 tracking-wide">
              Tip: Try “organza”, “eid”, or “bridal”.
            </p>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[calc(78vh-120px)]">
            {results.length > 0 ? (
              <div className="p-4 sm:p-5 grid gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl border border-[#efd6ad]/40 bg-white/80 p-3.5 hover:border-[#d4b892] hover:bg-[#fff7ea] transition-all"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-[#f5ebe0] overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.65rem] text-[#8b6f47]/70 uppercase tracking-[0.2em] mb-1">
                        {product.category}
                      </p>
                      <h4 className="text-sm sm:text-base text-[#2c2416] font-light group-hover:text-[#8b6f47] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm font-semibold text-[#2c2416] mt-1">
                        {product.price}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <span className="text-xs text-[#8b6f47]/60 group-hover:text-[#8b6f47] transition-colors">
                        View
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-12 text-center text-[#8b6f47]/70">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5ebe0] flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#8b6f47]/60" />
                </div>
                <p className="text-sm">
                  No products found for &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <div className="p-12 text-center text-[#8b6f47]/70">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5ebe0] flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#8b6f47]/60" />
                </div>
                <p className="text-sm">
                  Start typing to explore our collections
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
