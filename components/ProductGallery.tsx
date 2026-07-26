"use client";

import { Film, ImageIcon, Maximize2, Play, Video, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  videos?: string[];
}

export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
};

const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|mov|mkv)($|\?)/i.test(url);
};

export default function ProductGallery({
  images = [],
  videos = [],
}: ProductGalleryProps) {
  const [filter, setFilter] = useState<"all" | "images" | "videos">("all");
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Combine images and videos into unified media items list
  const allMediaItems = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = [];
    let counter = 1;

    // Add videos first if present
    (videos || []).forEach((vidUrl) => {
      if (vidUrl) {
        list.push({
          id: `video-${counter++}`,
          type: "video",
          url: vidUrl,
        });
      }
    });

    (images || []).forEach((imgUrl) => {
      if (!imgUrl) return;
      if (isVideoUrl(imgUrl)) {
        list.push({
          id: `video-${counter++}`,
          type: "video",
          url: imgUrl,
        });
      } else {
        list.push({
          id: `image-${counter++}`,
          type: "image",
          url: imgUrl,
        });
      }
    });

    return list;
  }, [images, videos]);

  const filteredMediaItems = useMemo(() => {
    if (filter === "images") {
      return allMediaItems.filter((item) => item.type === "image");
    }
    if (filter === "videos") {
      return allMediaItems.filter((item) => item.type === "video");
    }
    return allMediaItems;
  }, [allMediaItems, filter]);

  const activeMedia = useMemo(() => {
    if (!filteredMediaItems || filteredMediaItems.length === 0) return null;
    const found = filteredMediaItems.find((item) => item.id === selectedMediaId);
    return found || filteredMediaItems[0];
  }, [filteredMediaItems, selectedMediaId]);

  const hasVideos = allMediaItems.some((item) => item.type === "video");
  const hasImages = allMediaItems.some((item) => item.type === "image");

  if (!allMediaItems || allMediaItems.length === 0) {
    return (
      <div className="bg-gray-100 h-[500px] md:h-[600px] w-full flex flex-col items-center justify-center text-gray-400 rounded-2xl border border-gray-200">
        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm font-medium">No Media Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category / Filter Tabs if product has both photos and videos */}
      {hasVideos && hasImages && (
        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
              filter === "all"
                ? "bg-[#153532] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({allMediaItems.length})
          </button>
          <button
            onClick={() => setFilter("images")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
              filter === "images"
                ? "bg-[#153532] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos ({allMediaItems.filter((i) => i.type === "image").length})
          </button>
          <button
            onClick={() => setFilter("videos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
              filter === "videos"
                ? "bg-accent text-white shadow-sm"
                : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Videos ({allMediaItems.filter((i) => i.type === "video").length})
          </button>
        </div>
      )}

      {/* Main Display Area */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-black/5 border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
        {activeMedia ? (
          activeMedia.type === "video" ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                key={activeMedia.id}
                src={activeMedia.url}
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
                <Video className="w-4 h-4 text-accent animate-pulse" />
                <span>Product Video Preview</span>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full h-full cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image
                src={activeMedia.url}
                alt="Product Media"
                fill
                className="object-cover object-top"
                priority
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:scale-110"
                aria-label="Enlarge image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )
        ) : null}
      </div>

      {/* Thumbnails Navigation Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-gray-300">
        {filteredMediaItems.map((item, index) => {
          const isSelected = activeMedia?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedMediaId(item.id)}
              aria-label={`Select media ${index + 1}`}
              className={`relative w-20 h-20 shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-200 group ${
                isSelected
                  ? "border-accent ring-2 ring-accent/30 opacity-100 scale-[1.02]"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
              }`}
            >
              {item.type === "video" ? (
                <div className="relative w-full h-full bg-black/80 flex items-center justify-center">
                  <video
                    src={item.url}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Video
                  </span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover object-center"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Full-Screen Lightbox Modal for Full Image Zoom */}
      {isLightboxOpen && activeMedia && activeMedia.type === "image" && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeMedia.url}
              alt="Full view"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
