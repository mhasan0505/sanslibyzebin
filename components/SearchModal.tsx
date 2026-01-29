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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-900 text-sm focus:outline-none placeholder-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
            {results.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group"
                    role="button"
                    tabIndex={0}  
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-gray-100 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                        {product.category}
                      </p>
                      <h4 className="text-sm text-gray-900 font-light group-hover:text-gray-600 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {product.price}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <Search className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  No products found for &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-sm text-gray-400">
                  Type to search our collections
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
