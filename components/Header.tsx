"use client";

import { NAVIGATION_ITEMS } from "@/app/data/constants";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 z-20"
            aria-label="Sansli By Zebin"
          >
            <div
              className={`font-bold tracking-widest transition-all duration-300 ${
                isScrolled ? "text-gray-900 text-lg" : "text-white text-xl"
              }`}
            >
              SANSLI
            </div>
            <div
              className={`text-xs tracking-[0.2em] transition-all duration-300 ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              BY ZEBIN
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAVIGATION_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-light tracking-wide transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 z-20">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-white hover:text-white/80"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-white hover:text-white/80"
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-white hover:text-white/80"
              }`}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
