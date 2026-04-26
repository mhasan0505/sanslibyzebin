import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8ef_0%,#f5ede3_40%,#f6f2eb_100%)]">
      <div className="sticky top-0 z-40 flex flex-col">
        <div className="w-full overflow-hidden border-b border-[#8b6f47]/10 bg-linear-to-r from-[#ead7bb] via-[#f4e7d2] to-[#ead7bb] text-[#2c2416]">
          <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-2 px-6 py-2.5 text-xs md:text-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#5d462a]" />
            <p className="font-light tracking-wide text-center">
              <span className="hidden sm:inline">
                New Collection Launched •{" "}
              </span>
              <span className="font-medium">Free Shipping</span> on Orders Over
              TK5000
            </p>
          </div>
        </div>

        <header className="w-full border-b border-[#efd6ad]/50 bg-[#fffaf4]/95 shadow-[0_10px_35px_rgba(44,36,22,0.08)] backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 items-center py-3 sm:py-4">
              <div className="flex items-center justify-self-start gap-2">
                <div className="hidden lg:flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-[#5a4326]">
                  <Sparkles className="h-3.5 w-3.5 text-[#c9a777]" />
                  Handcrafted in Bangladesh
                </div>
              </div>

              <div className="flex items-center justify-self-center col-start-2">
                <Link
                  href="/"
                  className="group flex flex-col items-center shrink-0"
                  aria-label="Sansli By Zebin"
                >
                  <div className="mb-1 hidden items-center gap-1 sm:flex">
                    <div className="h-px w-10 bg-linear-to-r from-transparent to-[#d9ba92]" />
                    <Sparkles className="h-2.5 w-2.5 text-[#c9a777]" />
                    <div className="h-px w-10 bg-linear-to-l from-transparent to-[#d9ba92]" />
                  </div>

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

                  <div className="mt-2 h-px w-12 bg-linear-to-r from-[#d4b892] via-[#efd6ad] to-[#d4b892] sm:w-16" />
                </Link>
              </div>

              <div className="flex items-center justify-self-end col-start-3">
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center rounded-full border border-[#153532] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#153532] transition-colors hover:bg-[#153532] hover:text-white"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>
      {children}
    </div>
  );
}
