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
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const { isAuthenticated } = await checkAuth();
        
        if (!isMounted) return;
        
        if (requireAuth && !isAuthenticated && !isAuthPage) {
          router.push(redirectTo);
          return;
        }

        if (isAuthenticated && isAuthPage) {
          router.push('/admin/productos');
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        if (requireAuth && !isAuthPage) {
          router.push(redirectTo);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, requireAuth, redirectTo, router, isAuthPage]);

  return <>{children}</>;
}
