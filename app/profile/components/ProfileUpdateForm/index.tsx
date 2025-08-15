"use client";

import { useEffect, useState } from "react";
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
  FormMessage
} from "@/components/ui/form";
import { AlertCircle, CheckCircle } from "lucide-react";
import { getCurrentUserFromState, updateProfile } from "@/service/auth/authService";

import { useUbigeo } from "@/hooks/useUbigeo";


interface ProfileUpdateFormProps {
  id: string
}
// 🎯 Esquema de validación para update (sin password)
const updateSchema = z.object({
  nombres: z.string().min(2, "Nombre requerido"),
  apellidos: z.string().min(2, "Apellido requerido"),
  documentType: z.string().min(1, "Tipo documento requerido"),
  documentNumber: z.string().min(4, "Número documento requerido"),
  celular: z.string().min(6, "Celular requerido"),
  email: z.string().email("Email inválido"),
  direccion: z.string().optional(),
  departamento: z.string().min(1, "Departamento requerido"),
  provincia: z.string().min(1, "Provincia requerida"),
  distrito: z.string().min(1, "Distrito requerido"),
});

type FormData = z.infer<typeof updateSchema>;

export default function ProfileUpdateForm({id}: ProfileUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const { departments, provinces, districts, handleDepartmentChange, handleProvinceChange } = useUbigeo();

  const user = getCurrentUserFromState();

  const form = useForm<FormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      nombres: user?.name || "",
      apellidos: user?.lastname || "",
      documentType: user?.id_document_type ? String(user.id_document_type) : "",
      documentNumber: user?.document_number || "",
      celular: user?.phone || "",
      email: user?.email || "",
      direccion: user?.address || "",
      departamento: user?.deparment || "",
      provincia: user?.province || "",
      distrito: user?.district || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await updateProfile(data);
      setSubmitSuccess(res.message || "Perfil actualizado correctamente");
    } catch (error: any) {
      setSubmitError(error.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4 max-w-[900px]">
          
          {submitError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {submitSuccess}
            </div>
          )}

          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field}  /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl><Input type="tel" {...field} disabled={isLoading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departamento / Provincia / Distrito */}
          {/* Aquí puedes reutilizar exactamente el código que ya tienes en Register */}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar perfil"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
