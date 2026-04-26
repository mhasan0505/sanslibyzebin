import rawProducts from "@/data/products.json";
import { Product } from "@/types/product";
import { createProductSlug } from "@/utils/helpers";

type RawProduct = {
  id: number;
  name: string;
  fabric: string;
  description: string;
  sizeDescription?: string;
  price: number;
  overSize?: boolean;
  overSizePrice?: number;
  size: string;
  color: string;
  image: string[];
  inStock: boolean;
  newArrival?: boolean;
  category?: string;
};

const formattedPrice = (amount: number): string =>
  `৳ ${amount.toLocaleString("en-US")}`;

const defaultSizes = [
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "54",
  "56",
];

const productVariantOverrides: NonNullable<
  Product["landingPage"]
>["variantOverrides"] = {
  "eid-launch": {
    badge: "Eid Signature",
    primaryCta: "Book your Eid set",
  },
};

const productVariantOverridesById: Record<
  number,
  NonNullable<Product["landingPage"]>["variantOverrides"]
> = {
  1: {
    ...productVariantOverrides,
    remarketing: {
      badge: "Still Thinking?",
      offerText:
        "You checked this apricot co-ord before. Sizes are moving quickly, secure yours before the next restock cycle.",
      primaryCta: "Complete your apricot order",
    },
  },
  2: {
    ...productVariantOverrides,
    remarketing: {
      badge: "Back In Cart Mood",
      offerText:
        "Your black co-ord shortlist is waiting. Revisit this look and finish checkout in one step.",
      primaryCta: "Get the black set now",
    },
    "new-arrival": {
      badge: "Fresh Edit",
      headline: "Black Co-Ord Just Landed",
      offerText:
        "A clean, versatile black silhouette for everyday and occasion wear. Limited first-drop stock.",
      primaryCta: "Shop the black drop",
    },
  },
  3: {
    "eid-launch": {
      badge: "Eid Blue Edit",
      headline: "Eid-Ready Blue Co-Ord",
      offerText:
        "A statement blue look curated for festive gatherings with comfortable day-to-night wearability.",
      primaryCta: "Reserve Eid blue now",
    },
  },
  4: {
    remarketing: {
      offerText:
        "You already showed interest in this shade. Complete your order today before size options narrow.",
      primaryCta: "Return to checkout",
    },
  },
};

export const products: Product[] = (rawProducts as RawProduct[]).map(
  (item) => ({
    id: item.id,
    slug: createProductSlug(item.name, item.id),
    name: item.name,
    price: formattedPrice(item.price),
    priceValue: item.price,
    overSize: item.overSize ?? false,
    overSizePrice: item.overSizePrice
      ? formattedPrice(item.overSizePrice)
      : undefined,
    overSizePriceValue: item.overSizePrice,
    category:
      item.category === "3 piece set"
        ? "3 Piece Sets"
        : item.category === "co-ords"
          ? "Co-Ords"
          : item.category || "Co-Ords",
    description: item.description,
    sizeDescription: item.sizeDescription,
    images: item.image,
    sizes: defaultSizes,
    colors: [item.color],
    material: item.fabric,
    inStock: item.inStock,
    featured: item.id <= 4,
    newArrival: item.newArrival ?? false,
    landingPage: {
      badge: item.newArrival ? "New Arrival" : "Meta Offer",
      headline: item.name,
      subheadline:
        item.description ||
        "A refined look designed for confident everyday and occasion wear.",
      offerText: item.inStock
        ? "Limited stock available. Order before this style sells out."
        : "This design is currently unavailable. Explore the full product details for restock updates.",
      primaryCta: item.inStock ? "Order this look" : "View availability",
      benefits: [
        `Premium ${item.fabric.toLowerCase()} finish`,
        `Available in ${defaultSizes.length} size options`,
        `Curated ${item.color.toLowerCase()} colorway`,
      ],
      metaTitle: `${item.name} | Sansli By Zebin`,
      metaDescription: item.description,
      variantOverrides: productVariantOverridesById[item.id],
    },
  }),
);
