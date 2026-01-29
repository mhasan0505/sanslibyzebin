"use client";

import { useCart } from "@/context/CartContext";
import { useModal } from "@/hooks/useModal";
import { formatCurrency } from "@/utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } =
    useCart();
  const modal = useModal(isOpen);

  useEffect(() => {
    if (isOpen) {
      modal.open();
    } else {
      modal.close();
    }
  }, [isOpen, modal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-101 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg font-light tracking-wide text-gray-900">
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg text-gray-900 mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Add some items to get started!
                  </p>
                  <Link
                    href="/collections"
                    onClick={onClose}
                    className="bg-gray-900 text-white px-8 py-3 text-sm tracking-wide hover:bg-gray-800 transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="relative w-20 h-20 shrink-0 bg-gray-100 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-light text-gray-900 mb-1 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " • "}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          {item.product.price}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm font-light">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <button className="w-full bg-gray-900 text-white py-3 text-sm font-semibold tracking-wide hover:bg-gray-800 transition-all duration-300">
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-900 py-3 text-sm font-light hover:bg-gray-50 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
