"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";
import { loginAdmin } from "@/service/authAdmin/authAdminService";

// Schema de validación
const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLoginSuccess?: (user: any) => void;
  onLoginError?: (error: string) => void;
}

export function LoginForm({
  className,
  onLoginSuccess,
  onLoginError,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Login submitted:", data);

      const result = await loginAdmin({
        username: data.username,
        password: data.password,
      });

      if (result.success) {
        console.log("Login exitoso:", result.user);

        // Callback opcional de éxito
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }

        // Redirigir al dashboard o página principal
        router.push("/admin/productos"); // Ajusta la ruta según tu estructura

        // Aquí puedes agregar una notificación de éxito
        // CustomAlert(`Bienvenido ${result.user.username}`, "success", "top-center");
      }
    } catch (error: any) {
      console.error("Error en login:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al iniciar sesión. Verifique sus credenciales.";

      // Callback opcional de error
      if (onLoginError) {
        onLoginError(errorMessage);
      }

      // Aquí puedes agregar tu manejo de errores
      // CustomAlert(errorMessage, "error", "top-center");

      // Mostrar error en el formulario
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                  <p className="text-muted-foreground text-balance">
                    Inicie sesión en su cuenta de Chantilly
                  </p>
                </div>

                {/* Campo Usuario */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ingrese su usuario"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Contraseña */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingrese su contraseña"
                            {...field}
                            disabled={isLoading}
                            className="pr-10"
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

                {/* Mostrar error general si existe */}
                {form.formState.errors.root && (
                  <div className="text-sm font-medium text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                )}

                {/* Botón de submit */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Ingresando...
                    </div>
                  ) : (
                    "Ingresar"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/avatar.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
