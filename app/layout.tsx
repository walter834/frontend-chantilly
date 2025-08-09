import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import CustomOrders from "@/components/CustomOrders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "LA CASA DEL CHANTILLY SAC",
  description:
    "Los mejores productos artesanales con la más alta calidad y sabor único",
  keywords: "productos artesanales, chantilly, calidad, sabor",
  authors: [{ name: "Chantilly Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased overflow-x-hidden min-h-screen flex flex-col min-w-[350px]`}
      >
        <Navbar />
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <CustomOrders />
        <Footer />
      </body>
    </html>
  );
}
