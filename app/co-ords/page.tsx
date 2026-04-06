import { Metadata } from "next";

import ShopCatalog from "@/components/ShopCatalog";

export const metadata: Metadata = {
  title: "Co-Ords | Sansli By Zebin",
  description: "Browse all co-ord sets from Sansli By Zebin.",
};

export default function CoOrdsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Co-Ords Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all available co-ord designs in every color.
          </p>
        </div>

        <ShopCatalog eyebrow="Co-Ords Collection" resultsLabel="Showing" />
      </div>
    </div>
  );
}
