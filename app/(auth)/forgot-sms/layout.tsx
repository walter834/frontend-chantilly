//layout forgot-sms
"use client";

import { usePasswordRecoveryRedux } from "@/hooks/usePasswordRecoveryRedux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordRecoveryInitializer from "@/components/PasswordRecoveryInitializer";

export default function ForgotSmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, isInitialized } = usePasswordRecoveryRedux();
  const router = useRouter();

  // Verificar que el usuario tenga acceso a las páginas del flujo
  useEffect(() => {
    if (isInitialized) {
      const currentPath = window.location.pathname;
      
      // Si está en verify-code pero no tiene teléfono
      if (currentPath.includes('/verify-code') && !state.phone) {
        router.replace('/forgot-sms');
        return;
      }
      
      // Si está en reset pero no tiene teléfono, código o no está verificado
      if (currentPath.includes('/reset') && (!state.phone || !state.code || !state.isVerified)) {
        router.replace('/forgot-sms');
        return;
      }
    }
  }, [isInitialized, state.phone, state.code, state.isVerified, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <PasswordRecoveryInitializer>
        {children}
      </PasswordRecoveryInitializer>
    </div>
  );
}
