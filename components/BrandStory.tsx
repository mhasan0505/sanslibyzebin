"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-[#fffefb]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(239,214,173,0.15)_0%,transparent_35%,transparent_65%,rgba(139,111,71,0.09)_100%)]" />

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bf97] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#7a603c]">
              <Sparkles className="w-3.5 h-3.5" />
              The Sansli Journey
            </div>

            <h2 className="text-4xl md:text-6xl font-heading text-[#153532] leading-tight">
              A Story Sewn In
              <br />
              Culture, Comfort,
              <br />
              And Quiet Luxury
            </h2>

            <p className="max-w-2xl text-base md:text-lg text-[#4c3f2c] leading-relaxed">
              We started with one intention: bring heritage craft into modern
              wardrobes without losing softness, practicality, or elegance. Each
              co-ord is made to feel effortless in daily life while carrying the
              soul of traditional design.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#ecdcc5] bg-[#fff8ef] p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6f47]">
                  01 Origin
                </p>
                <p className="mt-2 text-[#2c2416] leading-relaxed text-sm">
                  Inspired by local textile traditions and artisanal techniques.
                </p>
              </div>
              <div className="rounded-xl border border-[#ecdcc5] bg-[#fff8ef] p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6f47]">
                  02 Process
                </p>
                <p className="mt-2 text-[#2c2416] leading-relaxed text-sm">
                  Premium fabric selection, considered cuts, and hand-finished
                  details.
                </p>
              </div>
              <div className="rounded-xl border border-[#ecdcc5] bg-[#fff8ef] p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6f47]">
                  03 Promise
                </p>
                <p className="mt-2 text-[#2c2416] leading-relaxed text-sm">
                  Casual luxury pieces designed for confidence and repeat wear.
                </p>
              </div>
            </div>

            <div className="inline-flex items-start gap-3 rounded-2xl border border-[#e7d4b7] bg-white p-5 max-w-2xl shadow-[0_10px_24px_rgba(44,36,22,0.08)]">
              <Quote className="w-5 h-5 text-[#8b6f47] shrink-0 mt-0.5" />
              <p className="text-[#3f3423] text-sm md:text-base leading-relaxed">
                We do not chase loud trends. We craft pieces that feel graceful,
                wearable, and relevant for years.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative h-[290px] md:h-[360px] rounded-2xl overflow-hidden border border-[#e7d4b7] shadow-[0_18px_44px_rgba(44,36,22,0.14)]">
                <Image
                  src="/images/co-ords/black/black%20(3).jpeg"
                  alt="Black co-ord editorial"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </div>
              <div className="relative h-[180px] rounded-2xl overflow-hidden border border-[#e7d4b7]">
                <Image
                  src="/images/co-ords/dark_mauve/dak-mauve%20(5).jpeg"
                  alt="Dark mauve craftsmanship"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 18vw"
                />
              </div>
              <div className="relative h-[180px] rounded-2xl overflow-hidden border border-[#e7d4b7]">
                <Image
                  src="/images/co-ords/meroon/meroon%20(5).jpeg"
                  alt="Meroon finishing detail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 18vw"
                />
              </div>

              <div className="col-span-2 rounded-xl border border-[#e7d4b7] bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b6f47] mb-2">
                  Signature Values
                </p>
                <p className="text-sm leading-relaxed text-[#3f3423]">
                  Refined fit, breathable comfort, and subtle statement styling.
                </p>
              </div>
              <Link
                href="/co-ords"
                className="inline-flex items-center justify-center rounded-xl bg-[#153532] px-4 py-3 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
              >
                Explore Co-Ords
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
