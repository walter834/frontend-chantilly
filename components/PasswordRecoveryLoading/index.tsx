"use client";

import { usePasswordRecoveryRedux } from '@/hooks/usePasswordRecoveryRedux';

interface PasswordRecoveryLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PasswordRecoveryLoading({ 
  children, 
  fallback = null 
}: PasswordRecoveryLoadingProps) {
  const { isInitialized } = usePasswordRecoveryRedux();

  // Mostrar fallback mientras se inicializa
  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
