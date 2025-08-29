"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CheckCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { forgotPassword } from "@/service/auth/authService";
import { BsEmojiTearFill } from "react-icons/bs";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

export default function ForgotPasswordForm({
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await forgotPassword(data.email);

      if (response.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Error al enviar el correo de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Correo enviado</h2>
          <p className="text-gray-600">
            Hemos enviado un enlace de recuperación a tu correo electrónico.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
        </div>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            No olvides revisar tu carpeta de spam si no encuentras el correo.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Enviar otro correo
          </Button>

          {onBackToLogin && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onBackToLogin}
            >
              Volver al login
            </Button>
          )}
        </div>
      </div>
    );
  }
  const emailValue = form.watch("email");
  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Correo electrónico
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                      disabled={isLoading}
                      className="pl-10" // Padding left para dejar espacio al ícono
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Ingresa el correo asociado a tu cuenta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#c41c1a] hover:bg-[#c41c1a] cursor-pointer"
            disabled={isLoading || !emailValue || emailValue.trim() === ""}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar enlace de recuperación
              </>
            )}
          </Button>

          
        </form>
      </Form>
    </div>
  );
}
