"use client";

import { ReactNode, useEffect } from 'react';
import { checkAuth } from '@/service/authAdmin/authAdminService';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface AuthProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthProvider({ 
  children, 
  requireAuth = false, 
  redirectTo = '/admin' 
}: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin' || pathname === '/admin/login';

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = checkAuth();
      
      if (requireAuth && !isAuthenticated && !isAuthPage) {
        router.push(redirectTo);
        return;
      }

      if (isAuthenticated && isAuthPage) {
        router.push('/admin/productos');
      }
    };

    verifyAuth();
  }, [pathname, requireAuth, redirectTo, router, isAuthPage]);

  return <>{children}</>;
}
