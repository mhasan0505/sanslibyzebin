import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Sunshine Yellow Set",
    price: "৳ 4,50,000",
    category: "Fusion",
    description:
      "A vibrant yellow fusion set featuring intricate embroidery and a modern silhouette. Perfect for daytime events and summer weddings.",
    images: [
      "/image01_yellow.png",
      "/image02_yellow.png",
      "/image01_yellow.png",
      "/image02_yellow.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "Gold"],
    material: "Silk with hand embroidery",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Royal Blue Ensemble",
    price: "৳ 2,80,000",
    category: "Sarees",
    description:
      "Elegant royal blue saree with silver zari work. A timeless piece for evening receptions.",
    images: [
      "/image03_blue.png",
      "/image04_blue.png",
      "/image03_blue.png",
      "/image04_blue.png",
    ],
    sizes: ["One Size"],
    colors: ["Royal Blue", "Navy"],
    material: "Pure silk with silver zari",
    inStock: true,
    featured: false,
  },
  {
    id: 3,
    name: "Golden Hour Lehenga",
    price: "৳ 3,20,000",
    category: "Lehengas",
    description:
      "Stunning golden lehenga that catches the light beautifully. Features a voluminous skirt and a handcrafted blouse.",
    images: [
      "/image02_yellow.png",
      "/image01_yellow.png",
      "/image02_yellow.png",
      "/image01_yellow.png",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Gold", "Champagne"],
    material: "Brocade with sequin work",
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: "Midnight Blue Gown",
    price: "৳ 1,85,000",
    category: "Gowns",
    description:
      "A sophisticated midnight blue gown with a flowing drape. Minimalist yet impactful.",
    images: [
      "/image04_blue.png",
      "/image03_blue.png",
      "/image04_blue.png",
      "/image03_blue.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Midnight Blue"],
    material: "Georgette with subtle shimmer",
    inStock: true,
    featured: false,
  },
];
