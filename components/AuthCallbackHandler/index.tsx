// components/AuthCallbackHandler.tsx
"use client";
import { useEffect } from 'react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function AuthCallbackHandler() {
  const { handleGoogleCallback } = useGoogleAuth();
  
  useEffect(() => {
    // Solo ejecutar si hay parámetros de Google auth en la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("token") && urlParams.get("customer")) {
      handleGoogleCallback();
    }
  }, []);

  return null; // No renderiza nada
}