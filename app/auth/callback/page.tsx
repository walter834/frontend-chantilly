"use client";

import { useEffect } from 'react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function AuthCallback() {
  const { handleGoogleCallback } = useGoogleAuth();
  
  useEffect(() => {
    handleGoogleCallback();
  }, []);

  return null; // No necesitamos mostrar nada ya que redirigiremos inmediatamente
}