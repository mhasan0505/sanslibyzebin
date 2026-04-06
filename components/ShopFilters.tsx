import { SORT_OPTIONS } from "@/app/data/constants";

type SortOption = "name" | "price-asc" | "price-desc" | "newest";

const colorSwatches: Record<string, string> = {
  Apricot: "#f2b68d",
  Black: "#111111",
  Blue: "#3f6ea8",
  "Dark Mauve": "#7a5a67",
  "Dark Orchesta": "#4e4452",
  Maroon: "#6d213c",
  "Misty Brown": "#b08c75",
  "Ocean Blue": "#2d6f96",
  Orange: "#da7b21",
  "Pale Brown": "#c6a388",
  "Parrot Pink": "#e46a8d",
  Purple: "#7b5ca8",
  "Reddish Brown": "#8b4b3f",
  Rosewood: "#7a4651",
  "Stone Blue": "#6d8799",
  Teal: "#277a78",
  Yellow: "#d8b22f",
};

const getColorSwatch = (color: string) => colorSwatches[color] ?? "#d1d5db";

interface ShopFiltersProps {
  categories: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  selectedCategory: string;
  selectedColors: string[];
  selectedSizes: string[];
  selectedMaterials: string[];
  priceBounds: [number, number];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: SortOption;
  resultsCount: number;
  onCategoryChange: (category: string) => void;
  onColorToggle: (color: string) => void;
  onSizeToggle: (size: string) => void;
  onMaterialToggle: (material: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onInStockChange: (value: boolean) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-900 mb-4">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function ShopFilters({
  categories,
  colors,
  sizes,
  materials,
  selectedCategory,
  selectedColors,
  selectedSizes,
  selectedMaterials,
  priceBounds,
  priceRange,
  inStockOnly,
  sortBy,
  resultsCount,
  onCategoryChange,
  onColorToggle,
  onSizeToggle,
  onMaterialToggle,
  onPriceChange,
  onInStockChange,
  onSortChange,
  onReset,
}: ShopFiltersProps) {
  const [minBound, maxBound] = priceBounds;
  const [minPrice, maxPrice] = priceRange;

  const updateMinPrice = (value: string) => {
    const parsedValue = Number(value);
    const nextMin = Number.isFinite(parsedValue)
      ? Math.max(minBound, Math.min(parsedValue, maxPrice))
      : minBound;

    onPriceChange([nextMin, maxPrice]);
  };

  const updateMaxPrice = (value: string) => {
    const parsedValue = Number(value);
    const nextMax = Number.isFinite(parsedValue)
      ? Math.min(maxBound, Math.max(parsedValue, minPrice))
      : maxBound;

    onPriceChange([minPrice, nextMax]);
  };

  return (
    <aside className="lg:sticky lg:top-28 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
            Refine Shop
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {resultsCount} products found
      </p>

      <div className="space-y-6">
        <FilterSection title="Sort">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-accent transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterSection>

        {categories.length > 1 && (
          <FilterSection title="Category">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-900"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        <FilterSection title="Price">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-gray-600">
              <span className="block mb-2">Min</span>
              <input
                type="number"
                min={minBound}
                max={maxBound}
                value={minPrice}
                onChange={(event) => updateMinPrice(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm text-gray-600">
              <span className="block mb-2">Max</span>
              <input
                type="number"
                min={minBound}
                max={maxBound}
                value={maxPrice}
                onChange={(event) => updateMaxPrice(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:border-accent"
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Range: BDT {minPrice.toLocaleString("en-US")} - BDT{" "}
            {maxPrice.toLocaleString("en-US")}
          </p>
        </FilterSection>

        <FilterSection title="Colors">
          <div className="space-y-3 max-h-52 overflow-auto pr-1">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1 text-sm text-gray-700 transition-colors hover:border-gray-200 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => onColorToggle(color)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span
                  className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: getColorSwatch(color) }}
                  aria-hidden="true"
                />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Sizes">
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeToggle(size)}
                  className={`rounded-xl border px-2 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-900"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Fabric">
          <div className="space-y-3">
            {materials.map((material) => (
              <label
                key={material}
                className="flex items-center gap-3 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => onMaterialToggle(material)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>{material}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Availability">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => onInStockChange(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Show only in-stock items</span>
          </label>
        </FilterSection>
      </div>
    </aside>
  );
}
