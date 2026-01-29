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
  title: "Sansli By Zebin - Luxury Bangladeshi Fashion",
  description:
    "Discover exquisite Bangladeshi fashion that blends heritage with modern aesthetics. Shop exclusive sarees, lehengas, and fusion wear.",
  keywords:
    "Bangladeshi fashion, sarees, lehengas, fusion wear, luxury clothing, designer wear, ethnic fashion, traditional wear",
  openGraph: {
    title: "Sansli By Zebin - Luxury Bangladeshi Fashion",
    description:
      "Exquisite Bangladeshi fashion blending heritage with modern aesthetics",
    type: "website",
  },
};

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
