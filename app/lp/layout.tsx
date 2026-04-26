import Link from "next/link";

export default function LandingPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8ef_0%,#f5ede3_40%,#f6f2eb_100%)]">
      <div className="sticky top-0 z-40 border-b border-[#eadcca] bg-[#fffaf4]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8b6b43]">
              Sansli By Zebin
            </p>
            <p className="mt-1 text-sm text-[#4c5957]">
              Focused product landing page for Meta campaign traffic.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center border border-[#153532] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#153532] transition-colors hover:bg-[#153532] hover:text-white"
          >
            Browse Store
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
