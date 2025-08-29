"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import {
  setPhone,
  setCode,
  setVerified,
  setInitialized,
  clearState,
  initializeFromStorage,
} from '@/store/slices/passwordRecoverySlice';
import { useEffect } from 'react';

export function usePasswordRecoveryRedux() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.passwordRecovery);

  // Inicializar desde sessionStorage solo una vez al montar el componente
  useEffect(() => {
    if (!state.isInitialized && typeof window !== 'undefined') {
      const storedPhone = sessionStorage.getItem('recovery_phone');
      const storedCode = sessionStorage.getItem('recovery_code');
      
      if (storedPhone || storedCode) {
        dispatch(initializeFromStorage({
          phone: storedPhone || undefined,
          code: storedCode || undefined,
          isVerified: !!storedCode,
        }));
      } else {
        dispatch(setInitialized(true));
      }
    }
  }, [state.isInitialized, dispatch]);

  const updatePhone = (phone: string) => {
    dispatch(setPhone(phone));
    // También guardar en sessionStorage como respaldo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recovery_phone', phone);
    }
  };

  const updateCode = (code: string) => {
    dispatch(setCode(code));
    // También guardar en sessionStorage como respaldo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recovery_code', code);
    }
  };

  const updateVerified = (verified: boolean) => {
    dispatch(setVerified(verified));
  };

  const clearRecoveryState = () => {
    dispatch(clearState());
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('recovery_phone');
      sessionStorage.removeItem('recovery_code');
    }
  };

  return {
    state,
    setPhone: updatePhone,
    setCode: updateCode,
    setVerified: updateVerified,
    clearState: clearRecoveryState,
    isInitialized: state.isInitialized,
  };
}
