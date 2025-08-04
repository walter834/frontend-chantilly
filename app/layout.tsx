import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Chantilly - Productos Artesanales",
  description: "Los mejores productos artesanales con la más alta calidad y sabor único",
  keywords: "productos artesanales, chantilly, calidad, sabor",
  authors: [{ name: "Chantilly Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased overflow-x-hidden min-h-screen flex flex-col`}
      >
        <Navbar />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
