// verify-code/page.tsx
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import passwordRecoveryService from "@/service/password/passwordRecoveryService";

interface VerifyRecoveryCodeContentProps {
  phone: string;
}

function VerifyRecoveryCodeContent({ phone }: VerifyRecoveryCodeContentProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-verificar cuando se completen los 6 dígitos
  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 6 && !isVerifying && phone) {
      handleVerifyCode();
    }
  }, [otp, isVerifying, phone]);

  const handleInputChange = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6 || !phone) return;

    try {
      setIsVerifying(true);
      setError("");
      setSuccess("");

      const response = await passwordRecoveryService.verifyRecoveryCode({
        phone: phone,
        code: otpCode,
      });

      setSuccess(response.message || "Código verificado correctamente");
      
      // Guardar el código ANTES de la navegación
      sessionStorage.setItem("recovery_code", otpCode);

      // Navegación con parámetros de URL para evitar parpadeos
      router.push(`/forgot-sms/reset?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(otpCode)}`);
      
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Código inválido o expirado";
      setError(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    if (countdown > 0 || !phone) return;

    try {
      setIsResending(true);
      setError("");
      setSuccess("");

      await passwordRecoveryService.sendRecoveryCode({ phone: phone });
      setCountdown(60);
      setSuccess("Código reenviado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al reenviar el código";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    sessionStorage.removeItem("recovery_phone");
    sessionStorage.removeItem("recovery_code");
    router.push("/forgot-sms");
  };

  const getInputClassName = (): string => {
    const baseClasses =
      "w-12 h-12 border rounded-xl text-xl font-semibold text-center transition-all duration-200 focus:outline-none hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed";

    if (error) {
      return `${baseClasses} border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20`;
    }
    if (success) {
      return `${baseClasses} border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20`;
    }
    return `${baseClasses} border-slate-600/10 focus:border-red-500 focus:ring-2 focus:ring-red-700/5`;
  };

  const formatPhoneDisplay = (phoneNumber: string): string => {
    if (!phoneNumber) return "";
    if (phoneNumber.length <= 4) return phoneNumber;

    const lastFour = phoneNumber.slice(-3);
    const masked = "*".repeat(Math.max(0, phoneNumber.length - 3));
    return `${masked.slice(0, 3)}-${masked.slice(3, 6)}-${lastFour}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl p-8 shadow-2xl border">
        <div className="flex justify-start mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-slate-400 transition-colors duration-200 cursor-pointer hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Cambiar número</span>
          </button>
        </div>

        <div className="flex justify-start mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-yellow-300 font-bold text-xl">C</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-3">Verificar Código</h1>
          <p className="text-sm leading-relaxed">
            Ingresa el código de 6 dígitos enviado a{" "}
            <span className="text-black font-bold">
              {formatPhoneDisplay(phone)}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        <div className="flex gap-3 mb-8 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying}
              className={getInputClassName()}
              placeholder="0"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyCode}
          disabled={otp.join("").length !== 6 || isVerifying}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25 disabled:shadow-none mb-6"
          type="button"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Verificado
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Verificar Código
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            ¿No recibiste el código?{" "}
            {countdown > 0 ? (
              <span className="text-slate-300">Reenviar en {countdown}s</span>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-red-400 hover:text-red-300 transition-colors duration-200 underline disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {isResending ? "Enviando..." : "Reenviar código"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook personalizado para manejar el teléfono
function useRecoveryPhone() {
  const phoneRef = useRef<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!isHydrated && typeof window !== "undefined") {
      const recoveryPhone = sessionStorage.getItem("recovery_phone");
      phoneRef.current = recoveryPhone || "";
      setIsHydrated(true);
    }
  }, [isHydrated]);

  return {
    phone: phoneRef.current,
    isValid: isHydrated && phoneRef.current !== "",
    isLoading: !isHydrated
  };
}

// Skeleton que replica exactamente la estructura del verify code
const VerifyCodeSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl p-8 shadow-2xl border">
      {/* Back button skeleton */}
      <div className="flex justify-start mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Logo skeleton */}
      <div className="flex justify-start mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-yellow-300 font-bold text-xl">C</span>
        </div>
      </div>

      {/* Title and description skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded mb-3 w-48 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* OTP inputs skeleton */}
      <div className="flex gap-3 mb-8 justify-center">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-12 h-12 border border-slate-600/10 rounded-xl bg-gray-100 animate-pulse"
          ></div>
        ))}
      </div>

      {/* Verify button skeleton */}
      <div className="w-full h-14 bg-red-300 rounded-xl mb-6 animate-pulse"></div>

      {/* Resend text skeleton */}
      <div className="text-center">
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function VerifyRecoveryCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPhone = searchParams.get('phone');
  
  // Usar el hook personalizado para obtener el teléfono de sessionStorage
  const { phone: storedPhone, isValid, isLoading } = useRecoveryPhone();
  
  // Priorizar el teléfono de la URL sobre el almacenado
  const phone = urlPhone || storedPhone;
  
  // Sincronizar con sessionStorage si viene de URL
  useEffect(() => {
    if (urlPhone) {
      sessionStorage.setItem("recovery_phone", urlPhone);
    }
  }, [urlPhone]);

  // Redirigir solo después de la hidratación si no hay datos válidos
  useEffect(() => {
    if (!isLoading && !urlPhone && !isValid) {
      router.replace("/forgot-sms");
    }
  }, [isLoading, isValid, router, urlPhone]);

  // Mostrar skeleton durante la hidratación o mientras redirige
  if (isLoading && !urlPhone) {
    return <VerifyCodeSkeleton />;
  }

  if (!phone) {
    router.replace("/forgot-sms");
    return <VerifyCodeSkeleton />;
  }

  return <VerifyRecoveryCodeContent phone={phone} />;
}