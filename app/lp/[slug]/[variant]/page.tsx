import ProductDetailPageContent from "@/components/ProductDetailPageContent";
import {
  getLandingVariantConfig,
  getLandingVariantKeys,
  withResolvedLandingContent,
} from "@/lib/landing-pages";
import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductLandingVariantPageProps {
  params: Promise<{
    slug: string;
    variant: string;
  }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().flatMap((slug) =>
    getLandingVariantKeys().map((variant) => ({ slug, variant })),
  );
}

export async function generateMetadata({
  params,
}: ProductLandingVariantPageProps): Promise<Metadata> {
  const { slug, variant } = await params;
  const product = getProductBySlug(slug);
  const variantConfig = getLandingVariantConfig(variant);

  if (!product || !variantConfig) {
    return {
      title: "Landing Variant Not Found | Sansli By Zebin",
    };
  }

  const landingProduct = withResolvedLandingContent(product, variant);

  return {
    title:
      landingProduct.landingPage?.metaTitle ||
      `${landingProduct.name} | ${variantConfig.label} | Sansli By Zebin`,
    description:
      landingProduct.landingPage?.metaDescription || landingProduct.description,
    openGraph: {
      title:
        landingProduct.landingPage?.metaTitle ||
        `${landingProduct.name} | ${variantConfig.label} | Sansli By Zebin`,
      description:
        landingProduct.landingPage?.metaDescription ||
        landingProduct.description,
      images: landingProduct.images[0]
        ? [{ url: landingProduct.images[0] }]
        : undefined,
    },
  };
}

export default async function ProductLandingVariantPage({
  params,
}: ProductLandingVariantPageProps) {
  const { slug, variant } = await params;
  const product = getProductBySlug(slug);
  const variantConfig = getLandingVariantConfig(variant);

  if (!product || !variantConfig) {
    notFound();
  }

  return (
    <ProductDetailPageContent
      product={withResolvedLandingContent(product, variant)}
      mode="landing"
      campaignLabel={variantConfig.label}
    />
  );
}
