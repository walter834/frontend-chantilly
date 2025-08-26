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
  const searchParams = useSearchParams();
  const urlPhone = searchParams?.get('phone');
  const urlCode = searchParams?.get('code');
  
  const dataRef = useRef<SessionData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Si tenemos parámetros en la URL, usarlos inmediatamente sin esperar hidratación
  if (urlPhone && urlCode) {
    // Sincronizar con sessionStorage para mantener consistencia
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem("recovery_phone") !== urlPhone) {
        sessionStorage.setItem("recovery_phone", urlPhone);
      }
      if (sessionStorage.getItem("recovery_code") !== urlCode) {
        sessionStorage.setItem("recovery_code", urlCode);
      }
    }
    
    return {
      phone: urlPhone,
      code: urlCode,
      isValid: true,
      isLoading: false
    };
  }

  // Efecto para manejar la hidratación una sola vez cuando no hay parámetros URL
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