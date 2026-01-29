export function ProductCardSkeleton() {
  return (
    <div className="group relative bg-white shadow-sm overflow-hidden rounded-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-[450px] w-full bg-gray-200" />

      {/* Product Info Skeleton */}
      <div className="p-6">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center bg-background animate-pulse">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6 pt-20 lg:pt-0">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="flex space-x-6">
            <div className="h-12 bg-gray-200 rounded w-48" />
            <div className="h-12 bg-gray-200 rounded w-32" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="w-full h-[80vh] bg-gray-200 rounded-tl-[100px]" />
        </div>
      </div>
    </div>
  );
}

export function TrendingProductsSkeleton() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
