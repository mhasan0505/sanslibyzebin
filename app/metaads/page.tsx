import LandingPageLinkManager from "@/components/LandingPageLinkManager";
import {
  getLandingPageHref,
  getLandingVariantConfig,
  getLandingVariantKeys,
} from "@/lib/landing-pages";
import { getAllProducts } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function OfferPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sanslibyzebin.com";
  const products = getAllProducts();

  const rows = products.map((product) => ({
    product,
    defaultPath: getLandingPageHref(product),
    variantPaths: getLandingVariantKeys().map((variant) => ({
      label: getLandingVariantConfig(variant)?.label || variant,
      path: getLandingPageHref(product, variant),
    })),
  }));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff9f2_0%,#f3ece3_100%)] pt-72 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#8b6b43]">
            Campaign Links
          </p>
          <h1 className="mt-4 text-4xl font-heading font-bold text-[#153532] md:text-5xl">
            Product landing URLs for Meta ads
          </h1>
          <p className="mt-4 text-base leading-7 text-[#556260]">
            Use the default landing page for general traffic and the campaign
            variants when you need audience-specific copy like remarketing or a
            festive launch push.
          </p>
        </div>

        <div className="mt-10 rounded-4xl border border-[#eadcca] bg-white/70 p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8b6b43]">
                Default route
              </p>
              <p className="mt-2 text-sm text-[#44514f]">/lp/[slug]</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8b6b43]">
                Variant route
              </p>
              <p className="mt-2 text-sm text-[#44514f]">
                /lp/[slug]/[variant]
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8b6b43]">
                Base domain
              </p>
              <p className="mt-2 break-all text-sm text-[#44514f]">{baseUrl}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <LandingPageLinkManager baseUrl={baseUrl} rows={rows} />
        </div>
      </div>
    </div>
  );
}
