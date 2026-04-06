import ShopCatalog from "@/components/ShopCatalog";

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exclusive collection of Indo-Western couture, where
            tradition meets contemporary design.
          </p>
        </div>

        <ShopCatalog />
      </div>
    </div>
  );
}
