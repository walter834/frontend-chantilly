"use client";

import { useEffect } from 'react';
import { usePasswordRecoveryRedux } from '@/hooks/usePasswordRecoveryRedux';

interface PasswordRecoveryInitializerProps {
  children: React.ReactNode;
}

export default function PasswordRecoveryInitializer({ children }: PasswordRecoveryInitializerProps) {
  const { isInitialized } = usePasswordRecoveryRedux();

  // No renderizar nada hasta que esté inicializado
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
