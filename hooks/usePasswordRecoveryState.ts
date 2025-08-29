"use client";

import { useEffect, useState } from 'react';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

export function usePasswordRecoveryState() {
  const { state, setPhone, setCode, setVerified, clearState } = usePasswordRecovery();
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar desde sessionStorage solo una vez al montar el componente
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      const storedPhone = sessionStorage.getItem('recovery_phone');
      const storedCode = sessionStorage.getItem('recovery_code');
      
      // Solo restaurar si el contexto está vacío
      if (storedPhone && !state.phone) {
        setPhone(storedPhone);
      }
      if (storedCode && !state.code) {
        setCode(storedCode);
        setVerified(true);
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized, state.phone, state.code, setPhone, setCode, setVerified]);

  return {
    state,
    setPhone,
    setCode,
    setVerified,
    clearState,
    isInitialized
  };
}