"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] w-full order-last lg:order-first"
          >
            <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="/image01_yellow.png"
                alt="Artisan at work"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-xs text-gray-500 tracking-widest uppercase mb-4">
                Our Story
              </p>
              <h2 className="text-5xl md:text-6xl text-gray-900 font-light leading-tight">
                Weaving Heritage Into Reality
              </h2>
            </div>

            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-xl">
              At Sansli By Zebin, we believe that fashion is more than just
              clothing—it&apos;s a dialogue between the past and the present.
              Our designs are rooted in the rich textile heritage of Bangladesh,
              reimagined for the modern woman who values tradition as much as
              her individuality.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-4xl font-light text-gray-900 mb-2">100+</p>
                <p className="text-sm text-gray-600">Unique Designs</p>
              </div>
              <div>
                <p className="text-4xl font-light text-gray-900 mb-2">100%</p>
                <p className="text-sm text-gray-600">Handcrafted</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
