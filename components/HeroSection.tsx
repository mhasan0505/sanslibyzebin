"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-24 overflow-hidden">
      {/* Minimalist gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white pointer-events-none" />

      <div className="container mx-auto px-6 h-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 lg:py-32">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4">
              <p className="text-xs tracking-widest font-light text-gray-500 uppercase">
                New Collection 2025
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight">
                Timeless <br />
                <span className="font-light italic text-gray-600">
                  Elegance
                </span>
              </h1>
            </div>

            <p className="text-base text-gray-600 leading-relaxed max-w-sm font-light">
              Discover the perfect blend of Bangladeshi heritage and modern
              couture. Exquisite handcrafted designs for the contemporary woman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/collections"
                className="px-8 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 w-fit"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 border border-gray-900 text-gray-900 text-sm tracking-wide hover:bg-gray-50 transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[400px] md:h-[600px] overflow-hidden bg-gray-100"
          >
            <Image
              src="/image01_yellow.png"
              alt="Elegant traditional wear"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
