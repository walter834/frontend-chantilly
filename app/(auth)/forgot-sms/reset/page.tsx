"use client"
import { useState } from "react";
import SmsResetFormContent from "./components/SmsResetFormContent";
import { useRouter } from "next/navigation";

export default function SmsResetForm() {
  const router = useRouter();
  
  // Leer sessionStorage directamente en la inicialización del estado
  const [data] = useState(() => {
    if (typeof window !== "undefined") {
      const recoveryPhone = sessionStorage.getItem("recovery_phone");
      const recoveryCode = sessionStorage.getItem("recovery_code");
      
      if (!recoveryPhone || !recoveryCode) {
        // Redirigir inmediatamente si no hay datos
        router.replace("/forgot-sms");
        return { phone: "", code: "", isValid: false };
      }
      
      return { 
        phone: recoveryPhone, 
        code: recoveryCode, 
        isValid: true 
      };
    }
    
    return { phone: "", code: "", isValid: false };
  });

  // Si no hay datos válidos, mostrar loading mínimo mientras redirige
  if (!data.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return <SmsResetFormContent phone={data.phone} code={data.code} />;
}