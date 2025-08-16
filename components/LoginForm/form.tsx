"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Home } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "@/lib/validators/auth";
import { loginUser, loginWithGoogle } from "@/service/auth/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onCloseDialog?: () => void;
  onOpenRegister?: () => void;
}

export default function Login({ onCloseDialog, onOpenRegister }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Login submitted:", data);
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });
      router.push("/");
      toast.success("Usuario registrado");
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Credenciales inválidas. Verifique su email y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      console.log("Google sign in clicked");
      loginWithGoogle();
    } catch (error) {
      console.error("Error en Google Sign In:", error);
      setIsGoogleLoading(false);
    }
  };

  // Función para manejar el click en "Olvidó su contraseña"
  const handleForgotPassword = () => {
    if (onCloseDialog) {
      onCloseDialog(); // Cierra el modal
    }
  };

  return (
    <div className="w-full overflow-hidden">
      

      {/* Form */}
      <Form {...form}>
        <form className="p-6 space-y-6 " onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ingrese su Usuario"
                    {...field}
                    disabled={isLoading}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Contraseña
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su Contraseña"
                      {...field}
                      disabled={isLoading}
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Enlace de "Olvidó contraseña" - MODIFICADO */}
          <div className="text-end -mt-4 mb-4">
            <Link
              href="/forgot-password"
              onClick={handleForgotPassword}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              ¿Olvidó su contraseña?
            </Link>
          </div>

          {/* Sign In button */}
          <Button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-3"
            disabled={isLoading || isGoogleLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          {/* Google Sign In button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full py-3 border-gray-300 hover:bg-gray-50"
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Conectando...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Inicia sesión con Google
              </>
            )}
          </Button>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
