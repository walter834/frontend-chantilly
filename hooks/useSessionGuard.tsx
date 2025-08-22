// hooks/useSessionGuard.ts
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseSessionGuardProps {
  requiredKeys: string[];
  redirectTo: string;
  onSuccess?: (data: Record<string, string>) => void;
}

interface UseSessionGuardReturn {
  isLoading: boolean;
  isReady: boolean;
  sessionData: Record<string, string>;
}

export function useSessionGuard({ 
  requiredKeys, 
  redirectTo, 
  onSuccess 
}: UseSessionGuardProps): UseSessionGuardReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [sessionData, setSessionData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Esperar a que el componente se monte completamente
    const checkSession = async () => {
      try {
        // Pequeña pausa para asegurar hidratación completa
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const data: Record<string, string> = {};
        let hasAllKeys = true;

        // Verificar todas las claves requeridas
        for (const key of requiredKeys) {
          const value = sessionStorage.getItem(key);
          if (!value || value.trim() === '') {
            hasAllKeys = false;
            break;
          }
          data[key] = value;
        }

        if (!hasAllKeys) {
          // Redirigir si faltan datos
          router.replace(redirectTo);
          return;
        }

        // Todo está bien, configurar datos y marcar como listo
        setSessionData(data);
        setIsReady(true);
        
        // Callback opcional cuando todo está listo
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.replace(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [requiredKeys, redirectTo, router, onSuccess]);

  return {
    isLoading,
    isReady,
    sessionData
  };
}