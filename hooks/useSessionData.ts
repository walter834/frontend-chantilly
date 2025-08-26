// hooks/useSessionData.ts
"use client";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SessionData {
  phone: string;
  code: string;
  isValid: boolean;
  isLoading: boolean;
}

export function useSessionData(): SessionData {
  const dataRef = useRef<SessionData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Efecto para manejar la hidratación una sola vez
  useEffect(() => {
    if (!isHydrated && typeof window !== 'undefined') {
      const recoveryPhone = sessionStorage.getItem("recovery_phone");
      const recoveryCode = sessionStorage.getItem("recovery_code");
      
      dataRef.current = {
        phone: recoveryPhone || "",
        code: recoveryCode || "",
        isValid: !!(recoveryPhone && recoveryCode),
        isLoading: false
      };
      
      setIsHydrated(true);
    }
  }, [isHydrated]);

  // Si aún no se ha hidratado, retornar estado de loading
  if (!isHydrated || dataRef.current === null) {
    return {
      phone: "",
      code: "",
      isValid: false,
      isLoading: true
    };
  }

  return dataRef.current;
}

// Hook más específico para recuperación de contraseña
export function usePasswordRecoveryData(): SessionData {
  return useSessionData();
}

// Hook para limpiar los datos de sesión
export function useClearRecoveryData() {
  return () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("recovery_phone");
      sessionStorage.removeItem("recovery_code");
    }
  };
}