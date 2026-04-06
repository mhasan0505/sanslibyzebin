import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | Sansli By Zebin",
  description:
    "Learn about Sansli By Zebin, our design philosophy, and our commitment to refined Bangladeshi fashion.",
};

const VALUES = [
  {
    title: "Craft-Led Design",
    description:
      "Every silhouette is shaped with comfort-first cuts and thoughtful detail placement.",
  },
  {
    title: "Premium Materials",
    description:
      "We source soft, breathable fabrics that hold structure while remaining easy to wear.",
  },
  {
    title: "Timeless Wearability",
    description:
      "Our pieces are designed to move across seasons and occasions with quiet confidence.",
  },
] as const;

const MILESTONES = [
  {
    label: "Founded",
    value: "2024",
  },
  {
    label: "Signature Co-Ords",
    value: "50+",
  },
  {
    label: "Returning Customers",
    value: "1.2K+",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-72 pb-16 md:pb-24">
      <section className="container mx-auto px-6">
        <div className="rounded-3xl border border-[#e7d4b7] bg-[#fffefb] p-6 md:p-10 lg:p-14 shadow-[0_22px_55px_rgba(44,36,22,0.08)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-[#d9bf97] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a603c]">
                About Sansli By Zebin
              </span>

              <h1 className="font-heading text-4xl leading-tight text-[#153532] md:text-6xl">
                Heritage-Inspired Pieces,
                <br />
                Made For Modern Everyday Luxury
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#4c3f2c] md:text-lg">
                Sansli By Zebin is a Bangladesh-based fashion label focused on
                refined ethnicwear. We blend artisanal inspiration with modern
                styling to create co-ords and occasion-ready pieces that feel as
                good as they look.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {MILESTONES.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#ecdcc5] bg-[#fff8ef] p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b6f47]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#2c2416]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative h-[280px] md:h-[360px] overflow-hidden rounded-2xl border border-[#e7d4b7]">
                <Image
                  src="/images/co-ords/black/black%20(3).jpeg"
                  alt="Sansli fashion editorial"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
              </div>

              <div className="relative h-[180px] overflow-hidden rounded-2xl border border-[#e7d4b7]">
                <Image
                  src="/images/co-ords/dark_mauve/dak-mauve%20(5).jpeg"
                  alt="Fabric details"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>

              <div className="relative h-[180px] overflow-hidden rounded-2xl border border-[#e7d4b7]">
                <Image
                  src="/images/co-ords/meroon/meroon%20(5).jpeg"
                  alt="Finishing craftsmanship"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 px-6 md:mt-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {VALUES.map((value, index) => (
            <article
              key={value.title}
              className="rounded-2xl border border-[#e7d4b7] bg-white p-6 shadow-[0_12px_30px_rgba(44,36,22,0.05)]"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b6f47]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-xl font-heading text-[#153532]">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4c3f2c] md:text-base">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-6 md:mt-20">
        <div className="rounded-2xl border border-[#e7d4b7] bg-[linear-gradient(120deg,#fff8ef_0%,#fffefb_60%,#f7ebdb_100%)] p-8 text-center md:p-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6f47]">
            Discover The Collection
          </p>
          <h2 className="mt-4 font-heading text-3xl text-[#153532] md:text-5xl">
            Designed For Everyday Elegance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#4c3f2c] md:text-base">
            Explore our latest co-ords and statement pieces curated for
            effortless dressing.
          </p>
          <Link
            href="/collections"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#153532] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0f2725]"
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
