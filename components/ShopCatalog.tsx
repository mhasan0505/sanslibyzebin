"use client";

import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import { sortProducts } from "@/utils/helpers";
import { useState } from "react";

interface ShopCatalogProps {
  eyebrow?: string;
  resultsLabel?: string;
}

const allCategories = [
  "All",
  ...new Set(products.map((product) => product.category)),
];
const allColors = [
  ...new Set(products.flatMap((product) => product.colors ?? [])),
].sort();
const allSizes = [
  ...new Set(products.flatMap((product) => product.sizes ?? [])),
].sort((firstSize, secondSize) => Number(firstSize) - Number(secondSize));
const allMaterials = [
  ...new Set(products.map((product) => product.material).filter(Boolean)),
].sort() as string[];
const allPrices = products.map((product) => product.priceValue);
const defaultPriceRange: [number, number] = [
  Math.min(...allPrices),
  Math.max(...allPrices),
];

const toggleSelection = (selectedValues: string[], value: string) =>
  selectedValues.includes(value)
    ? selectedValues.filter((selectedValue) => selectedValue !== value)
    : [...selectedValues, value];

export default function ShopCatalog({
  eyebrow = "Shop Collection",
  resultsLabel = "Showing",
}: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "price-asc" | "price-desc" | "newest"
  >("newest");

  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesColor =
      selectedColors.length === 0 ||
      (product.colors ?? []).some((color) => selectedColors.includes(color));
    const matchesSize =
      selectedSizes.length === 0 ||
      (product.sizes ?? []).some((size) => selectedSizes.includes(size));
    const matchesMaterial =
      selectedMaterials.length === 0 ||
      (product.material ? selectedMaterials.includes(product.material) : false);
    const matchesPrice =
      product.priceValue >= priceRange[0] &&
      product.priceValue <= priceRange[1];
    const matchesStock = !inStockOnly || Boolean(product.inStock);

    return (
      matchesCategory &&
      matchesColor &&
      matchesSize &&
      matchesMaterial &&
      matchesPrice &&
      matchesStock
    );
  });

  filteredProducts = sortProducts(filteredProducts, sortBy);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setPriceRange(defaultPriceRange);
    setInStockOnly(false);
    setSortBy("newest");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
      <ShopFilters
        categories={allCategories}
        colors={allColors}
        sizes={allSizes}
        materials={allMaterials}
        selectedCategory={selectedCategory}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        selectedMaterials={selectedMaterials}
        priceBounds={defaultPriceRange}
        priceRange={priceRange}
        inStockOnly={inStockOnly}
        sortBy={sortBy}
        resultsCount={filteredProducts.length}
        onCategoryChange={setSelectedCategory}
        onColorToggle={(color) =>
          setSelectedColors((currentColors) =>
            toggleSelection(currentColors, color),
          )
        }
        onSizeToggle={(size) =>
          setSelectedSizes((currentSizes) =>
            toggleSelection(currentSizes, size),
          )
        }
        onMaterialToggle={(material) =>
          setSelectedMaterials((currentMaterials) =>
            toggleSelection(currentMaterials, material),
          )
        }
        onPriceChange={setPriceRange}
        onInStockChange={setInStockOnly}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />

      <div>
        <div className="flex items-center justify-between mb-8 gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            {eyebrow}
          </p>
          <p className="text-sm text-gray-600 text-right">
            {resultsLabel} {filteredProducts.length} of {products.length}{" "}
            products
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-gray-500 text-lg">
              No products match the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
