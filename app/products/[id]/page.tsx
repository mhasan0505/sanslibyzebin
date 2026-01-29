"use client";

import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const product = id ? products.find((p) => p.id === Number(id)) : null;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Product Not Found
          </h2>
          <Link
            href="/collections"
            className="text-primary hover:text-accent underline"
          >
            Return to Collections
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedSize || undefined, selectedColor || undefined);
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
        <Link
          href="/collections"
          className="inline-flex items-center text-gray-600 hover:text-accent mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images || []} />
          </div>

          {/* Product Details */}
          <div>
            <p className="text-accent tracking-widest text-sm font-bold mb-2 uppercase">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              {product.name}
            </h1>
            <p className="text-3xl text-gray-900 font-bold mb-6">
              {product.price}
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border transition-all duration-300 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
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

            {/* Quantity Selector */}
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

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 px-6 font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> ADD TO CART
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

            {/* Product Details */}
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
                <li>
                  • {product.inStock ? "In Stock" : "Currently Unavailable"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
