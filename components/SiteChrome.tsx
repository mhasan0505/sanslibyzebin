"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/lp" || pathname.startsWith("/lp/");

  return (
    <>
      {!isLandingPage && <Header />}
      <main>{children}</main>
      {!isLandingPage && <Footer />}
    </>
  );
}
