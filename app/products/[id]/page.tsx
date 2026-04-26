import ProductDetailPageContent from "@/components/ProductDetailPageContent";
import { getProductById, getRelatedProducts } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const { getAllProductIds } = await import("@/lib/products");

  return getAllProductIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    return {
      title: "Product Not Found | Sansli By Zebin",
    };
  }

  return {
    title: `${product.name} | Sansli By Zebin`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Sansli By Zebin`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailPageContent
      product={product}
      relatedProducts={getRelatedProducts(product)}
    />
  );
}
