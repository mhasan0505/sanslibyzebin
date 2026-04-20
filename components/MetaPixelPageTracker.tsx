"use client";

import { trackPageView } from "@/lib/metaPixel";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MetaPixelPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const query = window.location.search.replace(/^\?/, "");
    const pagePath = query ? `${pathname}?${query}` : pathname;

    trackPageView(pagePath);
  }, [pathname]);

  return null;
}
