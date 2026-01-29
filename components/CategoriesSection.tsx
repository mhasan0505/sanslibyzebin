"use client";

import { CATEGORIES } from "@/app/data/constants";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Category images
const CATEGORY_IMAGES: Record<string, string> = {
  "Salwar Kameez": "/cat_salwar.jpg",
  Sarees: "/cat_saree.jpg",
  Kurtis: "/cat_kurti.jpg",
  Gowns: "/cat_gown.jpg",
  "Modest Wear": "/cat_modest.jpg",
};

export default function CategoriesSection() {
  // Filter out "All"
  const categoriesToShow = CATEGORIES.filter((c) => c !== "All").slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs text-gray-500 tracking-widest uppercase mb-3">
            Curated Collections
          </p>
          <h2 className="text-5xl md:text-6xl text-gray-900 font-light mb-6">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl">
            Explore our carefully curated collections of traditional and modern
            designs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesToShow.map((category, index) => (
            <Link
              key={category}
              href={`/${category.toLowerCase().replace(" ", "-")}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <Image
                    src={CATEGORY_IMAGES[category] || "/image01_yellow.png"}
                    alt={category}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="text-2xl text-gray-900 group-hover:text-gray-600 transition-colors mb-3">
                    {category}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
