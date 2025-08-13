// app/auth/callback/page.tsx - Versión con debug
"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        addDebug("🔍 Iniciando handleAuthCallback");

        // Obtener token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const error = urlParams.get("error");

        addDebug(
          `📋 URL params - token: ${token ? "EXISTE" : "NO EXISTE"}, error: ${
            error || "NO"
          }`
        );
        addDebug(`🌐 URL completa: ${window.location.href}`);

        if (error) {
          addDebug(`❌ Error en autenticación: ${error}`);
          setTimeout(() => {
            router.replace(`/login?error=${encodeURIComponent(error)}`);
          }, 2000);
          return;
        }

        if (token) {
          addDebug("💾 Guardando token en cookie...");

          // Guardar token en cookie

          addDebug("✅ Token guardado en cookie");

          // Limpiar URL de parámetros
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          addDebug("🧹 URL limpiada");

          // Obtener datos del usuario
          addDebug("👤 Obteniendo datos del usuario...");
          try {
          } catch (userError) {
            addDebug(`⚠️ Error obteniendo usuario: ${userError}`);
          }

          // Obtener URL de redirección guardada o ir al home
          const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
          localStorage.removeItem("redirectAfterLogin");

          addDebug(`🏠 Redirigiendo a: ${redirectUrl}`);

          setTimeout(() => {
            router.replace(redirectUrl);
          }, 2000); // Dar tiempo para ver los logs
        } else {
          addDebug("❌ No se recibió token en el callback");
          setTimeout(() => {
            router.replace("/login?error=no_token");
          }, 2000);
        }
      } catch (error) {
        addDebug(`💥 Error procesando callback: ${error}`);
        setTimeout(() => {
          router.replace("/login?error=callback_error");
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Procesando autenticación...</p>

        {/* Debug info */}
        <div className="mt-8 text-left text-xs bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">🐛 Debug Info:</h3>
          {debugInfo.map((info, index) => (
            <div key={index} className="mb-1">
              {info}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
