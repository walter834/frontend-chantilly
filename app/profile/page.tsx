"use client";
import React, { useState, useEffect } from "react";
import ProfileUpdateForm from "./components/ProfileUpdateForm";
import { useAuth } from "@/hooks/useAuth";

import { AlertCircle } from "lucide-react";

export default function Profile() {
  const { isAuthenticated, customerId, displayName } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Simular carga inicial del perfil
  useEffect(() => {
    if (isAuthenticated && customerId) {
      // Simular tiempo de carga (puedes reemplazar esto con tu lógica real)
      const timer = setTimeout(() => {
        setIsProfileLoading(false);
      }, 1000); // 1 segundo de simulación

      return () => clearTimeout(timer);
    } else {
      setIsProfileLoading(false);
    }
  }, [isAuthenticated, customerId]);

  // ✅ Verificar autenticación
  if (!isAuthenticated || !customerId) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Debe iniciar sesión para acceder a su perfil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center flex justify-center flex-col items-center container mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          TUS DATOS
        </h1>
        {displayName && (
          <p className="text-gray-600 mb-6">
            Hola, <span className="font-semibold">{displayName}</span>
          </p>
        )}

        <div className="w-full max-w-3xl bg-white rounded-lg p-6">
          {isProfileLoading ? (
            // Estado de carga
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c41d1ada]"></div>
                <span className="text-gray-600 text-sm">
                  Cargando datos del perfil...
                </span>
              </div>
            </div>
          ) : (
            // Formulario del perfil
            <ProfileUpdateForm id={String(customerId)} />
          )}
        </div>
      </div>
    </div>
  );
}
