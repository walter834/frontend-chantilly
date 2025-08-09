'use client'; // Si usas app router
import { handleAuthCallback } from '@/service/auth/authService';
import { useEffect } from 'react';


export default function AuthCallback() {
  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Procesando autenticación...</p>
      </div>
    </div>
  );
}