import ProductDetailPageContent from "@/components/ProductDetailPageContent";
import { withResolvedLandingContent } from "@/lib/landing-pages";
import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductLandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Landing Page Not Found | Sansli By Zebin",
    };
  }

  const landingProduct = withResolvedLandingContent(product);

  return {
    title:
      landingProduct.landingPage?.metaTitle ||
      `${landingProduct.name} | Sansli By Zebin`,
    description:
      landingProduct.landingPage?.metaDescription || landingProduct.description,
    openGraph: {
      title:
        landingProduct.landingPage?.metaTitle ||
        `${landingProduct.name} | Sansli By Zebin`,
      description:
        landingProduct.landingPage?.metaDescription ||
        landingProduct.description,
      images: landingProduct.images[0]
        ? [{ url: landingProduct.images[0] }]
        : undefined,
    },
  };
}

export default async function ProductLandingPage({
  params,
}: ProductLandingPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailPageContent
      product={withResolvedLandingContent(product)}
      mode="landing"
      campaignVariant={undefined}
    />
  );
}
