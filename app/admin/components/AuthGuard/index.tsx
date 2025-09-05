"use client";

import { useAuthAdmin } from "@/hooks/useAuthAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthAdmin();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado, redirigir al login del admin
    if (!isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="text-center text-gray-500">
          Verificando autenticación...
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}
