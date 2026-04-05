"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_SHOWCASE = [
  {
    title: "Co-Ords",
    subtitle: "Casual Luxury Staples",
    description: "Polished sets designed for everyday confidence.",
    href: "/co-ords",
    image: "/images/co-ords/dark_mauve/dak-mauve%20(1).jpeg",
    imageClassName: "object-[center_22%]",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh Weekly Picks",
    description: "Discover the latest drops before everyone else.",
    href: "/new-arrivals",
    image: "/images/co-ords/meroon/meroon%20(2).jpeg",
    imageClassName: "object-[center_20%]",
    className: "md:col-span-1",
  },
  {
    title: "Shop All",
    subtitle: "Complete Collection",
    description: "Browse every available style in one place.",
    href: "/collections",
    image: "/images/co-ords/black/black%20(2).jpeg",
    imageClassName: "object-[center_18%]",
    className: "md:col-span-1",
  },
] as const;

export default function CategoriesSection() {
  return (
    <section className="relative overflow-hidden py-18 md:py-24 bg-[#fffaf4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(239,214,173,0.45),transparent_32%),radial-gradient(circle_at_88%_30%,rgba(139,111,71,0.16),transparent_28%)]" />

      <div className="container mx-auto px-6 relative">
        <div className="mb-12 md:mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bf97] bg-white/85 px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#7a603c]">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Categories
          </div>
          <h2 className="mt-4 text-4xl md:text-6xl font-heading text-[#153532]">
            Shop The Edit
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-[#4c3f2c] leading-relaxed">
            Explore signature categories built around effortless silhouettes,
            refined detailing, and casual luxury styling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[290px] md:auto-rows-[250px]">
          {CATEGORY_SHOWCASE.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className={`group relative overflow-hidden rounded-2xl border border-[#ebd8bc] bg-[#f8ecde] shadow-[0_12px_34px_rgba(44,36,22,0.12)] ${category.className}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
                className="h-full"
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className={`object-cover ${category.imageClassName} transition-transform duration-700 group-hover:scale-105`}
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-[#1b150d]/80 via-[#2c2416]/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#f3ddbf] mb-2">
                    {category.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-heading text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#f7e8d1]/90 mb-4 max-w-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full border border-white/35 bg-white/10 px-4 py-2 group-hover:bg-white/20 transition-all">
                    Explore Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
