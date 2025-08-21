"use client"

import type React from "react"
import { useState, useRef, useEffect, use } from "react"
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import passwordRecoveryService from "@/service/passsword/passwordRecoveryService"

type Params = { phone: string }

export default function VerifyRecoveryCode({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params)
  const phone = resolvedParams.phone
  const router = useRouter()
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(23)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Decodificar el teléfono por si viene con caracteres especiales
  const decodedPhone = decodeURIComponent(phone)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Auto-verificar cuando se completen los 6 dígitos
  useEffect(() => {
    const otpCode = otp.join("")
    if (otpCode.length === 6 && !isVerifying) {
      handleVerifyCode()
    }
  }, [otp])

  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) return

    try {
      setIsVerifying(true)
      setError("")
      setSuccess("")

      const response = await passwordRecoveryService.verifyRecoveryCode({
        phone: decodedPhone,
        code: otpCode
      })

      setSuccess(response.message || "Código verificado correctamente")
      
      // Redirigir a la página de cambio de contraseña después de un breve delay
      setTimeout(() => {
        router.push(`/auth/reset-password/${decodedPhone}?code=${otpCode}`)
      }, 1500)

    } catch (err: any) {
      setError(err.message || "Código inválido o expirado")
      // Limpiar el OTP si hay error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return

    try {
      setIsResending(true)
      setError("")
      setSuccess("")

      await passwordRecoveryService.sendRecoveryCode({ 
        phone: decodedPhone 
      })

      setCountdown(60) // Reiniciar con más tiempo
      setSuccess("Código reenviado correctamente")
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000)

    } catch (err: any) {
      setError(err.message || "Error al reenviar el código")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700/50">
        {/* Logo */}
        <div className="flex justify-start mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-slate-800 font-bold text-xl">S</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold mb-3">Reset Your Password.</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Enter your 6 digit OTP code sent to{" "}
            <span className="text-white font-medium">{decodedPhone}</span> in order to reset.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* OTP Input Fields */}
        <div className="flex gap-3 mb-8 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying}
              className={`w-12 h-12 bg-slate-700/50 border rounded-xl text-white text-xl font-semibold text-center transition-all duration-200 focus:outline-none hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                error 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : success
                  ? 'border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
                  : 'border-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-slate-700'
              }`}
              placeholder="0"
            />
          ))}
        </div>

        {/* Verify Button - Solo visible si no es automático */}
        <button
          onClick={handleVerifyCode}
          disabled={otp.join("").length !== 6 || isVerifying}
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25 disabled:shadow-none mb-6"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Verified
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Verify Code
            </>
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-slate-300">Re-send in {countdown}s</span>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-red-400 hover:text-red-300 transition-colors duration-200 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Re-send Code"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}