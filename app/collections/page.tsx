"use client";

import { CATEGORIES, SORT_OPTIONS } from "@/app/data/constants";
import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";
import { filterByCategory, sortProducts } from "@/utils/helpers";
import { useState } from "react";

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<
    "name" | "price-asc" | "price-desc" | "newest"
  >("newest");

  // Filter and sort products
  let filteredProducts = filterByCategory(products, selectedCategory);
  filteredProducts = sortProducts(filteredProducts, sortBy);

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exclusive collection of Indo-Western couture, where
            tradition meets contemporary design.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm font-semibold tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="text-sm font-semibold text-gray-700"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "name"
                    | "price-asc"
                    | "price-desc"
                    | "newest"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
