"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Send, Loader2, ArrowLeft } from "lucide-react";
import passwordRecoveryService from "@/service/password/passwordRecoveryService";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Esquema de validación
const phoneVerificationSchema = z.object({
  phone: z
    .string()
    .min(9, "El número debe tener al menos 9 dígitos")
    .max(15, "El número no puede tener más de 15 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
});

type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;

interface PhoneVerificationProps {
  onSuccess?: (phoneNumber: string) => void;
  onError?: (error: string) => void;
}

export default function PhoneVerificationForm({
  onSuccess,
  onError,
}: PhoneVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const router = useRouter();

  const form = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phone: "",
    },
  });

  const phoneNumber = form.watch("phone");

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, "");

    // Limit to 15 digits (international standard)
    if (cleanValue.length > 15) {
      return cleanValue.slice(0, 15);
    }

    return cleanValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    form.setValue("phone", formatted);

    if (error) {
      setError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const onSubmit = async (data: PhoneVerificationFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      // Llamar al servicio con el número de teléfono
      const response = await passwordRecoveryService.sendRecoveryCode({
        phone: data.phone,
      });

      // Si llega aquí, el código se envió exitosamente
      setSuccessMessage(response.message || "Código enviado correctamente");

      // Guardar el teléfono en sessionStorage (se limpia al cerrar pestaña)
      sessionStorage.setItem("recovery_phone", data.phone);
      
      // Navegar a la página de verificación con parámetros en la URL
      router.push(`/forgot-sms/verify-code?phone=${encodeURIComponent(data.phone)}`);

      // Callbacks opcionales
      onSuccess?.(data.phone);
    } catch (err: any) {
      // Manejar el error del servicio
      const errorMessage =
        err.message || "Error al enviar el código de verificación";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex  justify-end w-full items-end">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="mx-auto w-16 h-16  rounded-full flex items-center justify-center shadow-lg">
            <Phone className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Verifica tu Número
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ingresa tu número de teléfono para recibir un código de
              verificación
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Número de Teléfono
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="987654321"
                          {...field}
                          onChange={(e) => {
                            handlePhoneChange(e);
                            field.onChange(e);
                          }}
                          disabled={isLoading}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-100 hover:border-gray-400 transition-colors"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!phoneNumber || phoneNumber.length < 9 || isLoading}
                className="w-full bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-medium py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar Código
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              ¿Ya tienes un código?{" "}
              <button
                type="button"
                className="text-red-700 hover:text-red-800 font-medium transition-colors underline decoration-transparent hover:decoration-current"
                onClick={() => {
                  // Guardar un placeholder o pedir que ingrese el número primero
                  if (phoneNumber && phoneNumber.length >= 9) {
                    sessionStorage.setItem("recovery_phone", phoneNumber);
                    router.push("/forgot-sms/verify-code");
                  } else {
                    setError("Primero ingresa tu número de teléfono");
                  }
                }}
              >
                Ingrésalo aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
