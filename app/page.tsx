"use client";

import BrandStory from "@/components/BrandStory";
import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import TrendingProducts from "@/components/TrendingProducts";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <TrendingProducts />
      <BrandStory />
    </div>
  );
}
