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
    pathname.startsWith("/reset") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/libro-reclamaciones")

  if (isClean) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full ">
      <Navbar />
      </header>
      <Header />
      <main className="flex-grow">
        {children}
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
      </main>
      
      <footer>
        <Footer />
      </footer>
      
      <div className="fixed bottom-4 right-4 z-50">
        <ChatWidget />
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
}
