"use client";

import Image from "next/image";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 h-[600px] w-full flex items-center justify-center text-gray-400">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with Zoom */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <Zoom>
          <div className="relative w-full h-full min-w-[300px] min-h-[300px]">
            <Image
              src={images[selectedImageIndex]}
              alt="Product Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Zoom>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative w-20 h-20 shrink-0 border-2 rounded-md overflow-hidden transition-all ${
              selectedImageIndex === index
                ? "border-accent opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
