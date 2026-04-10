"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 md:pt-72 pb-14 md:pb-20 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(239,214,173,0.42),transparent_40%),radial-gradient(circle_at_82%_24%,rgba(139,111,71,0.18),transparent_36%),linear-gradient(180deg,#fffdf9_0%,#fef9f3_58%,#fbf2e8_100%)]" />
      <div className="pointer-events-none absolute -top-16 right-12 h-44 w-44 rounded-full border border-[#d5b98f]/30" />
      <div className="pointer-events-none absolute bottom-8 left-6 h-24 w-24 rounded-full bg-[#efd6ad]/35 blur-2xl" />

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d5b98f] bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a603c] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Casual Luxury Edit
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-[#153532] leading-[0.95] text-5xl md:text-6xl lg:text-7xl">
                Casual
                <br />
                <span className="text-[#8b6f47]">Luxury</span>
                <br />
                Co-Ords
              </h1>
              <p className="max-w-xl text-[15px] md:text-base leading-relaxed text-[#3f3423]">
                Everyday ease meets refined detailing. Soft premium cotton,
                effortless silhouettes, and elegant finishing made for polished
                day-to-night styling.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/co-ords"
                className="group inline-flex w-fit items-center gap-2 rounded-md bg-[#153532] px-7 py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-[#0f2725]"
              >
                Shop Co-Ords
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex w-fit items-center rounded-md border border-[#8b6f47]/45 bg-white/70 px-7 py-3.5 text-sm font-semibold tracking-wide text-[#2c2416] hover:border-[#8b6f47] hover:bg-[#fff7ea]"
              >
                Browse Collections
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 md:gap-4">
              <div className="rounded-lg border border-[#efd6ad] bg-white/75 p-3 md:p-4">
                <p className="text-xl md:text-2xl font-semibold text-[#153532]">
                  13+
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8b6f47]">
                  Color Stories
                </p>
              </div>
              <div className="rounded-lg border border-[#efd6ad] bg-white/75 p-3 md:p-4">
                <p className="text-xl md:text-2xl font-semibold text-[#153532]">
                  36-50
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8b6f47]">
                  Size Range
                </p>
              </div>
              <div className="rounded-lg border border-[#efd6ad] bg-white/75 p-3 md:p-4">
                <p className="text-xl md:text-2xl font-semibold text-[#153532]">
                  100%
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#8b6f47]">
                  Casual Luxury
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative h-[470px] sm:h-[560px] rounded-3xl overflow-hidden border border-[#e8d7be] bg-[#f7ecdf] shadow-[0_24px_80px_rgba(44,36,22,0.18)]">
              <Image
                src="/images/co-ords/teal/teal%20(3).jpeg"
                alt="Sansli co-ord outfit in teal"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-3 md:-left-8 top-8 rounded-xl border border-[#e8d7be] bg-white/90 px-4 py-3 backdrop-blur-sm shadow-lg"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8b6f47]">
                Signature Fabric
              </p>
              <p className="mt-1 text-sm font-semibold text-[#153532]">
                Pop Corn Cotton
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 4.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-2 md:-right-6 bottom-10 w-[172px] rounded-xl border border-[#e8d7be] bg-white p-2 shadow-lg"
            >
              <div className="relative h-24 overflow-hidden rounded-md">
                <Image
                  src="/images/co-ords/rosewood/rosewood%20(2).jpeg"
                  alt="Rosewood co-ord preview"
                  fill
                  className="object-cover"
                  sizes="172px"
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.17em] text-[#8b6f47]">
                Rosewood Edit
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
