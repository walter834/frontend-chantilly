"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PasswordRecoveryState {
  phone: string;
  code: string;
  isVerified: boolean;
}

interface PasswordRecoveryContextType {
  state: PasswordRecoveryState;
  setPhone: (phone: string) => void;
  setCode: (code: string) => void;
  setVerified: (verified: boolean) => void;
  clearState: () => void;
}

const initialState: PasswordRecoveryState = {
  phone: '',
  code: '',
  isVerified: false,
};

const PasswordRecoveryContext = createContext<PasswordRecoveryContextType | undefined>(undefined);

export function PasswordRecoveryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PasswordRecoveryState>(initialState);

  const setPhone = (phone: string) => {
    setState(prev => ({ ...prev, phone }));
    // También guardar en sessionStorage como respaldo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recovery_phone', phone);
    }
  };

  const setCode = (code: string) => {
    setState(prev => ({ ...prev, code }));
    // También guardar en sessionStorage como respaldo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recovery_code', code);
    }
  };

  const setVerified = (verified: boolean) => {
    setState(prev => ({ ...prev, isVerified: verified }));
  };

  const clearState = () => {
    setState(initialState);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('recovery_phone');
      sessionStorage.removeItem('recovery_code');
    }
  };

  return (
    <PasswordRecoveryContext.Provider value={{
      state,
      setPhone,
      setCode,
      setVerified,
      clearState,
    }}>
      {children}
    </PasswordRecoveryContext.Provider>
  );
}

export function usePasswordRecovery() {
  const context = useContext(PasswordRecoveryContext);
  if (context === undefined) {
    throw new Error('usePasswordRecovery must be used within a PasswordRecoveryProvider');
  }
  return context;
}