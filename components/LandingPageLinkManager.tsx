"use client";

import { Product } from "@/types/product";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LandingPageLinkManagerProps {
  baseUrl: string;
  rows: Array<{
    product: Product;
    defaultPath: string;
    variantPaths: Array<{
      label: string;
      path: string;
    }>;
  }>;
}

export default function LandingPageLinkManager({
  baseUrl,
  rows,
}: LandingPageLinkManagerProps) {
  const [copiedValue, setCopiedValue] = useState("");

  const handleCopy = async (path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedValue(fullUrl);
    window.setTimeout(() => {
      setCopiedValue("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {rows.map(({ product, defaultPath, variantPaths }) => (
        <section
          key={product.id}
          className="rounded-[1.75rem] border border-[#eadcca] bg-white/90 p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8b6b43]">
                {product.category}
              </p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-[#153532]">
                {product.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#556260]">
                {product.landingPage?.offerText || product.description}
              </p>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#153532] transition-colors hover:text-accent"
            >
              View product page <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#eee5d9] bg-[#f9f5ef] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b6b43]">
                Default landing page
              </p>
              <p className="mt-3 break-all text-sm text-[#33413f]">{`${baseUrl}${defaultPath}`}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleCopy(defaultPath)}
                  className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#6f5637]"
                >
                  <Copy className="h-4 w-4" /> Copy URL
                </button>
                <Link
                  href={defaultPath}
                  target="_blank"
                  className="inline-flex items-center gap-2 border border-[#153532] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#153532] transition-colors hover:bg-[#153532] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" /> Open
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {variantPaths.map((variant) => {
                const fullUrl = `${baseUrl}${variant.path}`;

                return (
                  <div
                    key={variant.path}
                    className="rounded-2xl border border-[#eee5d9] bg-white p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b6b43]">
                      {variant.label}
                    </p>
                    <p className="mt-2 break-all text-sm text-[#33413f]">
                      {fullUrl}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCopy(variant.path)}
                        className="inline-flex items-center gap-2 bg-[#153532] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#0e2624]"
                      >
                        <Copy className="h-4 w-4" /> Copy URL
                      </button>
                      <Link
                        href={variant.path}
                        target="_blank"
                        className="inline-flex items-center gap-2 border border-[#153532] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#153532] transition-colors hover:bg-[#153532] hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" /> Open
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {copiedValue.startsWith(`${baseUrl}${defaultPath}`) && (
            <p className="mt-4 text-sm font-medium text-[#2e7d32]">
              Copied default landing URL.
            </p>
          )}
          {variantPaths.some(
            (variant) => `${baseUrl}${variant.path}` === copiedValue,
          ) && (
            <p className="mt-4 text-sm font-medium text-[#2e7d32]">
              Copied variant landing URL.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
