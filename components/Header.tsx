"use client";

import { NAVIGATION_ITEMS } from "@/app/data/constants";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import { useCart } from "@/context/CartContext";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const { cartCount } = useCart();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <AnimatePresence>
          {showPromo && !isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
              className="overflow-hidden border-b border-[#8b6f47]/10 bg-linear-to-r from-[#ead7bb] via-[#f4e7d2] to-[#ead7bb] text-[#2c2416] w-full"
            >
              <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-2 px-6 py-2.5 text-xs md:text-sm relative">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#5d462a]" />
                <p className="font-light tracking-wide text-center">
                  <span className="hidden sm:inline">
                    New Collection Launched •{" "}
                  </span>
                  <span className="font-medium">Free Shipping</span> on Orders
                  Over TK5000
                </p>
                <button
                  onClick={() => setShowPromo(false)}
                  className="absolute right-4 md:right-6 p-1 hover:bg-[#2c2416]/10 rounded-full transition-colors"
                  aria-label="Close banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full transition-all duration-500 ease-in-out ${
            isScrolled
              ? "border-b border-[#efd6ad]/50 bg-[#fffaf4]/95 shadow-[0_10px_35px_rgba(44,36,22,0.08)] backdrop-blur-xl"
              : "bg-[#fffaf4]/88 backdrop-blur-md"
          }`}
        >
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 items-center py-3 sm:py-4 relative">
              {/* Left Section */}
              <div className="flex items-center justify-self-start gap-2">
                <div className="lg:hidden z-10 relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rounded-full border border-[#efd6ad]/50 bg-white/70 p-2 text-[#5b4428] transition-all duration-300 hover:border-[#d4b892] hover:text-[#2c2416]"
                    aria-label="Menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-nav"
                  >
                    <AnimatePresence mode="wait">
                      {isMobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-4 w-4" strokeWidth={1.7} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="h-4 w-4" strokeWidth={1.7} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-[#5a4326]">
                  <Sparkles className="h-3.5 w-3.5 text-[#c9a777]" />
                  Handcrafted in Bangladesh
                </div>
              </div>

              {/* Center Section */}
              <div className="flex items-center justify-self-center z-20 col-start-2">
                <Link
                  href="/"
                  className="group flex flex-col items-center shrink-0"
                  aria-label="Sansli By Zebin"
                >
                  <motion.div
                    className="mb-1 hidden items-center gap-1 sm:flex"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="h-px w-10 bg-linear-to-r from-transparent to-[#d9ba92]" />
                    <Sparkles
                      className="h-2.5 w-2.5 text-[#c9a777]"
                      strokeWidth={2}
                    />
                    <div className="h-px w-10 bg-linear-to-l from-transparent to-[#d9ba92]" />
                  </motion.div>

                  <div className="text-center">
                    <Image
                      src="/Logo_02.webp"
                      alt="Sansli By Zebin Logo"
                      width={200}
                      height={100}
                      className="h-auto w-28 sm:w-36 lg:w-44"
                      priority
                    />
                  </div>

                  <motion.div
                    className="mt-2 h-px w-12 bg-linear-to-r from-[#d4b892] via-[#efd6ad] to-[#d4b892] sm:w-16"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </Link>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-self-end gap-1 sm:gap-2 z-20 col-start-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="rounded-full border border-transparent p-2 text-[#5b4428] transition-all duration-300 hover:border-[#efd6ad]/60 hover:bg-white/80 hover:text-[#2c2416] sm:p-2.5"
                  aria-label="Search"
                >
                  <Search
                    className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]"
                    strokeWidth={1.6}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex rounded-full border border-transparent p-2 text-[#5b4428] transition-all duration-300 hover:border-[#efd6ad]/60 hover:bg-white/80 hover:text-[#2c2416] sm:p-2.5"
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]" strokeWidth={1.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(true)}
                  className="relative rounded-full border border-transparent p-2 text-[#5b4428] transition-all duration-300 hover:border-[#efd6ad]/60 hover:bg-white/80 hover:text-[#2c2416] sm:p-2.5"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag
                    className="w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]"
                    strokeWidth={1.5}
                  />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 bg-linear-to-br from-[#efd6ad] to-[#d4b892] text-[#2c2416] text-[0.6rem] rounded-full min-w-4.5 h-4.5 flex items-center justify-center font-semibold px-1 shadow-lg border border-[#8b6f47]/20"
                    >
                      <span className="sr-only">items in cart</span>
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>

            <nav className="hidden w-full items-center justify-center pb-4 lg:flex">
              <div className="flex flex-wrap items-center justify-center gap-1 rounded-4xl border border-[#efd6ad]/50 bg-white/70 p-1.5 shadow-[0_8px_22px_rgba(212,184,146,0.16)] px-3">
                {NAVIGATION_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="group relative rounded-full px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.22em] text-[#4a3823] transition-all duration-300 hover:bg-[#f7ebdb] hover:text-[#1f170d]"
                    >
                      {item.label}
                      <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-[#b88a53] transition-all duration-300 group-hover:w-2/3" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-[#efd6ad]/40 bg-[#fffaf4]/98 backdrop-blur-xl lg:hidden"
                id="mobile-nav"
              >
                <div className="mx-auto max-h-[calc(100vh-120px)] max-w-screen-xl overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="mb-4 border-b border-[#efd6ad]/40 pb-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5a4326]">
                      Menu
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    {NAVIGATION_ITEMS.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="group flex items-center justify-between rounded-xl border border-transparent px-4 py-3.5 text-sm font-light tracking-wide text-[#4f3a21] transition-all duration-200 hover:border-[#efd6ad]/50 hover:bg-white/70 hover:text-[#2c2416]"
                        >
                          <span>{item.label}</span>
                          <motion.span
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-[#efd6ad]/40 pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#5a4326]">
                      <Sparkles className="w-3 h-3 text-[#d4b892]" />
                      <span>Traditional Elegance • Modern Style</span>
                    </div>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
