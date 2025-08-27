"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Importamos los componentes del sidebar
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white shadow-md">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-xl font-bol">
              Panel de Administración
            </h1>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-100">
          {children}
        </div>

        {/* Footer de administración */}
        <footer className="bg-white py-4 px-6 border-t">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Panel de Administración - La Casa
            del Chantilly
          </div>
        </footer>
      </SidebarInset>

      {/* Notificaciones */}
      <Toaster />
    </SidebarProvider>
  );
}
