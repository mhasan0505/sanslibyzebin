import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sanslibyzebin.com",
  ),
  title: "Sansli By Zebin - Luxury Bangladeshi Fashion",
  description:
    "Discover exquisite Bangladeshi fashion that blends heritage with modern aesthetics. Shop exclusive sarees, lehengas, and fusion wear.",
  keywords:
    "Bangladeshi fashion, sarees, lehengas, fusion wear, luxury clothing, designer wear, ethnic fashion, traditional wear",
  icons: {
    icon: [{ url: "/Logo.webp", type: "image/webp" }],
    shortcut: ["/Logo.webp"],
    apple: ["/Logo.webp"],
  },
  openGraph: {
    title: "Sansli By Zebin - Luxury Bangladeshi Fashion",
    description:
      "Exquisite Bangladeshi fashion blending heritage with modern aesthetics",
    type: "website",
  },
};

import MetaPixelPageTracker from "@/components/MetaPixelPageTracker";
import SiteChrome from "@/components/SiteChrome";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "964446712667457";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel base code — IIFE creates the queue stub and injects fbevents.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <CartProvider>
          <WishlistProvider>
            <MetaPixelPageTracker />
            <SiteChrome>{children}</SiteChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
