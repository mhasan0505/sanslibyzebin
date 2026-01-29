import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";

// Define params type for Next.js 15
type Params = Promise<{ category: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const category = decodeURIComponent(params.category).replace(/-/g, " ");

  return {
    title: `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } | Sansli By Zebin`,
    description: `Explore our exclusive collection of ${category}.`,
  };
}

export default async function CategoryPage(props: { params: Params }) {
  const params = await props.params;
  const categorySlug = decodeURIComponent(params.category);
  const categoryName = categorySlug.replace(/-/g, " ");

  // Simple filter logic - strictly matching category or "all"
  // In a real app, this would query a DB or filter more robustly
  // Since mock data might not match exactly, we'll try to find partial matches or show all for demo if needed.
  // Actually, let's filter by category property in products.

  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase() === "new arrivals" // Show all or sorted by date for new arrivals
  );

  return (
    <div className="bg-secondary min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 capitalize">
            {categoryName}
          </h1>
          <p className="text-gray-500 tracking-widest text-xs uppercase">
            {categoryProducts.length} Premium Products
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
