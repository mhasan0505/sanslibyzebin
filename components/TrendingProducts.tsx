"use client";

import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

export default function TrendingProducts() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-16">
          <div>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-3">
              Featured Selection
            </p>
            <h2 className="text-5xl md:text-6xl text-gray-900 font-light">
              Trending Now
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="slider-container -mx-4">
          <Slider ref={sliderRef} {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-4 py-4">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 tracking-wide transition-colors duration-300 border-b border-gray-300 hover:border-gray-900 pb-2"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
