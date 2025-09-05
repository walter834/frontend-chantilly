import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/Providers";
import { Providers } from "./providers";
import LayoutShell from "@/components/layout/LayoutShell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  
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
    <html lang="es" className={`${poppins.className}`} suppressHydrationWarning>
      <head>
        <script
          src="https://static-content-qas.vnforapps.com/v2/js/checkout.js"
          data-sessiontoken=""
          data-channel="web"
          data-merchantid=""
          data-purchasenumber=""
          data-amount=""
          data-currency="PEN"
          data-action=""
          data-timeouturl=""
          data-merchant-logo=""
          data-merchant-name=""
          data-customer-email=""
          data-customer-mobile=""
          data-customer-document=""
          data-customer-document-type=""
          data-customer-country=""
          data-customer-city=""
          data-customer-address=""
          data-customer-phone=""
          data-customer-lastname=""
          data-customer-firstname=""
          data-customer-postalcode=""
          data-customer-state=""
          data-customer-street=""
          data-customer-streetnumber=""
          data-customer-streetname=""
          data-customer-streettype=""
          data-customer-streetaddressline1=""
          data-customer-streetaddressline2=""
          data-customer-streetaddressline3=""
          data-customer-streetaddressline4=""
          data-customer-streetaddressline5=""
          data-customer-streetaddressline6=""
          data-customer-streetaddressline7=""
          data-customer-streetaddressline8=""
          data-customer-streetaddressline9=""
          data-customer-streetaddressline10=""
          data-customer-streetaddressline11=""
          data-customer-streetaddressline12=""
          data-customer-streetaddressline13=""
          data-customer-streetaddressline14=""
          data-customer-streetaddressline15=""
          data-customer-streetaddressline16=""
          data-customer-streetaddressline17=""
          data-customer-streetaddressline18=""
          data-customer-streetaddressline19=""
          data-customer-streetaddressline20=""
          async
        ></script>
      </head>
      <body className={`${poppins.className} antialiased overflow-x-hidden min-h-screen flex flex-col min-w-[350px]`}>
        <Providers>
          <StoreProvider>
            <LayoutShell>{children}</LayoutShell>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
