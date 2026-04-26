"use client";

import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackViewContent } from "@/lib/metaPixel";
import { Product } from "@/types/product";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductDetailPageContentProps {
  product: Product;
  relatedProducts?: Product[];
  mode?: "default" | "landing";
  campaignLabel?: string;
  campaignVariant?: string;
}

const defaultLandingBenefits = [
  "Premium tailoring with a polished drape",
  "Flexible sizing for a confident fit",
  "Ready for festive, casual, and occasion wear",
];

export default function ProductDetailPageContent({
  product,
  relatedProducts = [],
  mode = "default",
  campaignLabel,
  campaignVariant,
}: ProductDetailPageContentProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isOversizeSelected, setIsOversizeSelected] = useState(false);
  const router = useRouter();

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    trackViewContent(product);
  }, [product]);

  const oversizeSizes = ["48", "50", "52", "54", "56"];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    if (product.overSize && oversizeSizes.includes(size)) {
      setIsOversizeSelected(true);
    } else {
      setIsOversizeSelected(false);
    }
  };

  const inWishlist = isInWishlist(product.id);
  const landingBenefits = product.landingPage?.benefits?.length
    ? product.landingPage.benefits
    : defaultLandingBenefits;

  const currentPrice = isOversizeSelected
    ? product.overSizePrice
    : product.price;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedSize || undefined,
      selectedColor || undefined,
      quantity,
    );

    if (mode === "landing") {
      const query = new URLSearchParams({
        lp_slug: product.slug,
      });

      if (campaignVariant) {
        query.set("lp_variant", campaignVariant);
      }

      router.push(`/lp/checkout?${query.toString()}`);
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-6">
        {mode === "default" ? (
          <Link
            href="/collections"
            className="inline-flex items-center text-gray-600 hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
          </Link>
        ) : (
          <section className="mb-10 rounded-4xl border border-[#e7ddd2] bg-[linear-gradient(135deg,#fbf7f2_0%,#f4ece3_100%)] p-8 md:p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-accent">
                  {product.landingPage?.badge || "Meta Offer"}
                </p>
                {campaignLabel && (
                  <p className="mb-4 inline-flex rounded-full border border-[#d4b892] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#6d5332]">
                    Campaign: {campaignLabel}
                  </p>
                )}
                <h1 className="max-w-3xl text-4xl font-heading font-bold leading-tight text-[#153532] md:text-6xl">
                  {product.landingPage?.headline || product.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#4d5a58] md:text-lg">
                  {product.landingPage?.subheadline || product.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#purchase-panel"
                    className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#6f5637]"
                  >
                    {product.landingPage?.primaryCta || "Order this look"}
                  </a>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center justify-center border border-[#153532] px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-[#153532] transition-colors hover:bg-[#153532] hover:text-white"
                  >
                    Full product page
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8b6b43]">
                  Why this works
                </p>
                <p className="mt-3 text-3xl font-heading font-bold text-[#153532]">
                  {product.price}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4d5a58]">
                  {product.landingPage?.offerText ||
                    "Designed to convert ad traffic into direct product intent with one focused shopping path."}
                </p>
                <div className="mt-6 space-y-3">
                  {landingBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-2xl border border-[#eee4d8] bg-white px-4 py-3 text-sm text-[#2a3a38]"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2">
          <div>
            <ProductGallery images={product.images || []} />
          </div>

          <div id="purchase-panel">
            <p className="text-accent tracking-widest text-sm font-bold mb-2 uppercase">
              {product.category}
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#153532] mb-4">
              {product.name}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <p className="text-3xl text-gray-900 font-bold">
                  {currentPrice || product.price}
                </p>
                {isOversizeSelected && product.overSizePrice && (
                  <p className="text-sm text-accent font-semibold">
                    Oversize Premium
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                  product.inStock
                    ? "bg-[#e8f5e9] text-[#2e7d32]"
                    : "bg-[#ffebee] text-[#c62828]"
                }`}
              >
                {product.inStock ? "Available" : "Stock Out"}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {product.sizeDescription && (
              <div className="mb-8 rounded-2xl border border-[#e8ddcf] bg-[#fbf6ef] p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#6d5332]">
                  Size Description
                </h3>
                <ul className="space-y-2 text-sm text-[#44514f]">
                  {product.sizeDescription.split("\n").map((line) => {
                    const text = line.trim();
                    if (!text) {
                      return null;
                    }

                    return <li key={text}>• {text}</li>;
                  })}
                </ul>
              </div>
            )}

            {mode === "landing" && campaignLabel && (
              <div className="mb-8 rounded-2xl border border-[#ece2d5] bg-white px-5 py-4 text-sm text-[#44514f]">
                This version is tuned for the{" "}
                <span className="font-semibold text-[#153532]">
                  {campaignLabel}
                </span>{" "}
                campaign flow.
              </div>
            )}

            {mode === "landing" && (
              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {landingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-2xl border border-[#ece2d5] bg-[#f9f4ee] px-4 py-3 text-sm text-[#44514f]"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isOversize =
                      product.overSize && oversizeSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 border transition-all duration-300 relative ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 text-gray-700 hover:border-accent"
                        }`}
                      >
                        {size}
                        {isOversize && (
                          <span className="ml-1 inline-block text-xs bg-accent text-white rounded-full px-2 py-0.5">
                            +
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border transition-all duration-300 ${
                        selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:border-accent"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 ${
                  product.inStock
                    ? "bg-accent hover:bg-[#6f5637] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } py-4 px-6 font-bold tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock
                  ? mode === "landing"
                    ? product.landingPage?.primaryCta || "ORDER THIS LOOK"
                    : "ADD TO CART"
                  : "STOCK OUT"}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`border p-4 transition-all duration-300 ${
                  inWishlist
                    ? "border-accent bg-accent text-white"
                    : "border-gray-300 text-gray-600 hover:border-accent hover:text-accent"
                }`}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`}
                />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-primary font-heading font-bold mb-4">
                Product Details
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                {product.material && <li>• Material: {product.material}</li>}
                <li>• Premium quality fabric</li>
                <li>• Intricate hand embroidery</li>
                <li>• Custom fitting available</li>
                <li>• Dry clean only</li>
                <li>• Status: {product.inStock ? "Available" : "Stock Out"}</li>
              </ul>
            </div>
          </div>
        </div>

        {mode === "default" && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {mode === "landing" && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadcca] bg-[#fffaf4]/95 p-4 shadow-[0_-10px_30px_rgba(44,36,22,0.08)] backdrop-blur-xl md:hidden">
            <a
              href="#purchase-panel"
              className="flex items-center justify-center bg-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#6f5637]"
            >
              {product.landingPage?.primaryCta || "Order this look"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
