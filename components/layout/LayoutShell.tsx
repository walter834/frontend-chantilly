"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomOrders from "@/components/CustomOrders";
import OnlyHome from "@/components/OnlyHome";
import ThemedProductsSection from "@/components/features/ThemedProductsSection";
import LocalCardGrid from "@/app/contacto/components/LocalCardGrid";
import ChatWidget from "@/components/Chatbot";
import { Toaster } from "@/components/ui/sonner";
import { getBanner } from "@/service/bannerService";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isClean =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/politicas-privacidad" ||
    pathname.startsWith("/politicas-privacidad/") ||
    pathname === "/terminos-condiciones" ||
    pathname.startsWith("/terminos-condiciones/") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/forgot-sms") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/reset");



  if (isClean) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="relative z-50">
        <Navbar />
      </div>
      
      <div className="relative z-40">
        <Header />
      </div>
      
      <main className="flex-1 relative z-10">{children}</main>
      
      <div className="relative z-[9999]">
        <Toaster />
      </div>
      
      <CustomOrders />
      <OnlyHome>
        <ThemedProductsSection />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Locales más cercanos a tu ubicación
        </h1>
        <p className="text-center mt-4 text-muted-foreground text-xl">
          Conoce un poco más de nuestros locales a nivel nacional
        </p>
        <LocalCardGrid limit={3} />
      </OnlyHome>
      <Footer />
      
      <div className="relative z-30">
        <ChatWidget />
      </div>
    </>
  );
}