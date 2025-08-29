"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import passwordRecoveryService from "@/service/password/passwordRecoveryService";
import { SmsResetPasswordSchema } from "@/lib/validators/reset-sms";
import { usePasswordRecoveryRedux } from "@/hooks/usePasswordRecoveryRedux";

type SmsResetValues = z.infer<typeof SmsResetPasswordSchema>;

interface SmsResetFormContentProps {
  phone: string;
  code: string;
}

export default function SmsResetFormContent({
  phone,
  code,
}: SmsResetFormContentProps) {
  const router = useRouter();
  const { clearState } = usePasswordRecoveryRedux();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SmsResetValues>({
    resolver: zodResolver(SmsResetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<SmsResetValues> = async (values) => {
    setIsLoading(true);
    try {
      await passwordRecoveryService.resetPassword({
        phone: phone,
        code: code,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      toast.success("Contraseña restablecida exitosamente.");

      // Limpiar el contexto
      clearState();

      setTimeout(() => router.push("/"), 1500);
    } catch (e) {
      toast.error(
        "Error al restablecer la contraseña. Código inválido o expirado."
      );
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneDisplay = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length <= 4) return phoneNumber;
    const lastFour = phoneNumber.slice(-3);
    const masked = "*".repeat(Math.max(0, phoneNumber.length - 3));
    return `${masked.slice(0, 3)}-${masked.slice(3, 6)}-${lastFour}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-sm rounded-2xl p-8 shadow-2xl border bg-white">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-700 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Nueva Contraseña</h1>
          <p className="text-muted-foreground text-sm">
            Establecer nueva contraseña para: {formatPhoneDisplay(phone)}
          </p>
        </div>

        <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">
              Código SMS verificado correctamente
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nueva Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                      className="focus:border-red-500 focus:ring-red-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
                      className="focus:border-red-500 focus:ring-red-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-medium mb-1">Requisitos:</p>
              <ul className="space-y-1">
                <li>• Mínimo 8 caracteres</li>
                <li>• Debe incluir letras y números</li>
                <li>• Se recomienda usar símbolos especiales</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-medium py-4 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-red-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Estableciendo contraseña...
                </div>
              ) : (
                "ESTABLECER CONTRASEÑA"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
          >
            ← Volver al inicio
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Una vez establecida, podrás iniciar sesión con tu nueva contraseña
          </p>
        </div>
      </div>
    </div>
  );
}