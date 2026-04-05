import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata = {
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
          <p className="text-gray-500 tracking-widest text-xs uppercase mt-4">
            {products.length} Products
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No co-ord products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}