import rawProducts from "@/data/products.json";
import { Product } from "@/types/product";

type RawProduct = {
  id: number;
  name: string;
  fabric: string;
  description: string;
  price: number;
  size: string;
  color: string;
  image: string[];
  quantity: number;
  newArrival?: boolean;
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

export const products: Product[] = (rawProducts as RawProduct[]).map(
  (item) => ({
    id: item.id,
    name: item.name,
    price: formattedPrice(item.price),
    priceValue: item.price,
    category: "Co-Ords",
    description: item.description,
    images: item.image,
    sizes: defaultSizes,
    colors: [item.color],
    material: item.fabric,
    inStock: item.quantity > 0,
    featured: item.id <= 4,
    newArrival: item.newArrival ?? false,
  }),
);
