"use client";

import { useAuthAdmin } from "@/hooks/useAuthAdmin";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { checkAuth } from "@/service/authAdmin/authAdminService";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isLoginPage = pathname === '/admin' || pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        // Verificar autenticación con las cookies
        const { isAuthenticated: isAuth } = await checkAuth();
        
        if (!isMounted) return;
        
        // Si la página requiere autenticación y el usuario no está autenticado
        if (requireAuth && !isAuth && !isLoginPage) {
          router.push('/admin');
          return;
        }

        // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
        if (isAuth && isLoginPage) {
          router.push('/admin/productos');
          return;
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        if (requireAuth && !isLoginPage) {
          router.push('/admin');
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, pathname, requireAuth, isLoginPage, router]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="text-center text-gray-500">
              Verificando autenticación...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no requiere autenticación o el usuario está autenticado, mostrar el contenido
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Si requiere autenticación pero el usuario no está autenticado, redirigir
  // (la redirección ya se maneja en el useEffect)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  );
}
