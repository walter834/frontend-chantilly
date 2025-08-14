"use client";

import ResetForm from "./ResetForm";

export default function Reset() {
  return (
    <div
      className="w-full max-w-md mx-auto 
     flex flex-col justify-center py-10"
    >
      <div className="text-center mb-6">
        <p className="text-xl font-bold1">Restablece tu contraseña</p>
      </div>

      <ResetForm />

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        Al continuar, aceptas nuestros Términos de servicio y Política de
        privacidad.
      </p>
    </div>
  );
}
