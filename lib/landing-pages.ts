import {
  Product,
  ProductLandingVariantCopy,
  ProductLandingVariantKey,
} from "@/types/product";

export type LandingVariantKey = ProductLandingVariantKey;

export interface LandingVariantConfig {
  slug: LandingVariantKey;
  label: string;
  badge: string;
  headline?: string;
  subheadline?: string;
  offerText?: string;
  primaryCta?: string;
  benefits?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

const LANDING_VARIANT_PRESETS: Record<LandingVariantKey, LandingVariantConfig> =
  {
    "eid-launch": {
      slug: "eid-launch",
      label: "Eid Launch",
      badge: "Eid Edit",
      offerText:
        "Built for festive campaigns with a sharper urgency message and gift-season positioning.",
      primaryCta: "Reserve this Eid look",
    },
    remarketing: {
      slug: "remarketing",
      label: "Remarketing",
      badge: "Back In Focus",
      offerText:
        "Designed for warm audiences who already viewed the product and need one clean path back to checkout intent.",
      primaryCta: "Complete your order",
    },
    "new-arrival": {
      slug: "new-arrival",
      label: "New Arrival Push",
      badge: "Just Dropped",
      offerText:
        "Built for cold traffic campaigns that need novelty-led messaging and a stronger first-impression angle.",
      primaryCta: "Shop the new drop",
    },
  };

export function getLandingVariantKeys(): LandingVariantKey[] {
  return Object.keys(LANDING_VARIANT_PRESETS) as LandingVariantKey[];
}

export function getLandingVariantConfig(
  variant: string,
): LandingVariantConfig | undefined {
  if (!(variant in LANDING_VARIANT_PRESETS)) {
    return undefined;
  }

  return LANDING_VARIANT_PRESETS[variant as LandingVariantKey];
}

export function resolveLandingContent(
  product: Product,
  variant?: string,
): Product["landingPage"] {
  const baseLanding = product.landingPage || {};
  const variantConfig = variant ? getLandingVariantConfig(variant) : undefined;
  const productVariantOverride = (
    variantConfig
      ? baseLanding.variantOverrides?.[variantConfig.slug]
      : undefined
  ) as ProductLandingVariantCopy | undefined;

  if (!variantConfig) {
    return baseLanding;
  }

  return {
    ...baseLanding,
    badge:
      productVariantOverride?.badge || variantConfig.badge || baseLanding.badge,
    headline:
      productVariantOverride?.headline ||
      variantConfig.headline ||
      baseLanding.headline,
    subheadline:
      productVariantOverride?.subheadline ||
      variantConfig.subheadline ||
      baseLanding.subheadline,
    offerText:
      productVariantOverride?.offerText ||
      variantConfig.offerText ||
      baseLanding.offerText,
    primaryCta:
      productVariantOverride?.primaryCta ||
      variantConfig.primaryCta ||
      baseLanding.primaryCta,
    benefits:
      productVariantOverride?.benefits ||
      variantConfig.benefits ||
      baseLanding.benefits,
    metaTitle:
      productVariantOverride?.metaTitle ||
      variantConfig.metaTitle ||
      `${product.name} | ${variantConfig.label} | Sansli By Zebin`,
    metaDescription:
      productVariantOverride?.metaDescription ||
      variantConfig.metaDescription ||
      productVariantOverride?.offerText ||
      variantConfig.offerText ||
      baseLanding.metaDescription,
  };
}

export function withResolvedLandingContent(
  product: Product,
  variant?: string,
): Product {
  return {
    ...product,
    landingPage: resolveLandingContent(product, variant),
  };
}

export function getLandingPageHref(product: Product, variant?: string): string {
  return variant ? `/lp/${product.slug}/${variant}` : `/lp/${product.slug}`;
}
