"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { getDocumentTypes, updateProfile } from "@/service/auth/authService";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useAuth } from "@/hooks/useAuth";
import api from "@/service/api";

// Schema de validación para actualización de perfil (sin passwords)
const profileUpdateSchema = z.object({
  nombres: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios"),
  apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(50, "Los apellidos no pueden tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios"),
  documentType: z.string().min(1, "Seleccione un tipo de documento"),
  documentNumber: z
    .string()
    .min(8, "El número de documento debe tener al menos 8 caracteres")
    .max(15, "El número de documento no puede tener más de 15 caracteres"),
  celular: z
    .string()
    .min(9, "El celular debe tener al menos 9 dígitos")
    .max(12, "El celular no puede tener más de 12 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  email: z
    .string()
    .email("Ingrese un email válido")
    .min(1, "El email es requerido"),
  direccion: z.string().optional(),
  departamento: z.string().min(1, "Seleccione un departamento"),
  provincia: z.string().min(1, "Seleccione una provincia"),
  distrito: z.string().min(1, "Seleccione un distrito"),
});

type FormData = z.infer<typeof profileUpdateSchema>;

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  id_document_type: number;
  document_number: string;
  phone: string;
  address?: string;
  deparment: string;
  province: string;
  district: string;
  status: number;
  google_id?: string | null;
}

interface ProfileUpdateFormProps {
  id: string;
}

export default function ProfileUpdateForm({ id }: ProfileUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const { token } = useAuth();

  // Hook para manejar ubigeo
  const {
    departments,
    provinces,
    districts,
    handleDepartmentChange,
    handleProvinceChange,
    handleDistrictChange,
    getDepartmentName,
    getProvinceName,
    getDistrictName,
    
  } = useUbigeo();

  const form = useForm<FormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      documentType: "",
      documentNumber: "",
      celular: "",
      email: "",
      direccion: "",
      departamento: "",
      provincia: "",
      distrito: "",
    },
  });

  // Cargar tipos de documento
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error("Error cargando tipos de documento:", error);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocumentTypes();
  }, []);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !id) return;

      try {
        setIsLoadingUser(true);
        const response = await api.get<{ customer: User }>(`/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data.customer;
        console.log("Datos del usuario cargados:", userData);

        // Buscar códigos de ubigeo basados en los nombres
        const departmentCode = departments.find(d => d.name === userData.deparment)?.code || "";
        
        // Si encontramos el departamento, cargar sus provincias
        if (departmentCode) {
          await handleDepartmentChange(departmentCode);
          
          // Buscar el código de la provincia
          setTimeout(async () => {
            const provinceCode = provinces.find(p => p.name === userData.province)?.code || "";
            
            if (provinceCode) {
              await handleProvinceChange(provinceCode);
              
              // Buscar el código del distrito
              setTimeout(() => {
                const districtCode = districts.find(d => d.name === userData.district)?.code || "";
                
                // Actualizar formulario con todos los datos
                form.reset({
                  nombres: userData.name || "",
                  apellidos: userData.lastname || "",
                  documentType: String(userData.id_document_type) || "",
                  documentNumber: userData.document_number || "",
                  celular: userData.phone || "",
                  email: userData.email || "",
                  direccion: userData.address || "",
                  departamento: departmentCode,
                  provincia: provinceCode,
                  distrito: districtCode,
                });
              }, 100);
            }
          }, 100);
        } else {
          // Si no encontramos el departamento, solo llenar los datos básicos
          form.reset({
            nombres: userData.name || "",
            apellidos: userData.lastname || "",
            documentType: String(userData.id_document_type) || "",
            documentNumber: userData.document_number || "",
            celular: userData.phone || "",
            email: userData.email || "",
            direccion: userData.address || "",
            departamento: "",
            provincia: "",
            distrito: "",
          });
        }

      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
        setSubmitError("Error al cargar los datos del usuario");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [id, token, form, departments, provinces, districts]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      console.log("Datos del formulario (códigos):", data);

      // Convertir códigos a nombres antes de enviar
      const dataWithNames = {
        id: parseInt(id),
        name: data.nombres.trim(),
        lastname: data.apellidos.trim(),
        email: data.email.trim().toLowerCase(),
        id_document_type: parseInt(data.documentType),
        document_number: data.documentNumber.trim(),
        phone: data.celular.trim(),
        address: data.direccion?.trim() || "",
        deparment: getDepartmentName(data.departamento),
        province: getProvinceName(data.provincia),
        district: getDistrictName(data.distrito),
      };

      console.log("Datos convertidos para envío:", dataWithNames);

      const response = await updateProfile(dataWithNames);
      console.log("Respuesta del servidor:", response);

      setSubmitSuccess(response.message || "Perfil actualizado exitosamente");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess("");
      }, 3000);

    } catch (error: unknown) {
      console.error("Error completo:", error);

      let errorMessage = "Error al actualizar perfil";

      if (error && typeof error === "object") {
        const err = error as { status?: number; message?: string };
        if (err.status === 422) {
          errorMessage = err.message || "Error de validación. Revise los datos ingresados.";
        } else if (err.status === 409) {
          errorMessage = "El email o número de documento ya están registrados.";
        } else if (err.status === 400) {
          errorMessage = err.message || "Datos inválidos.";
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando datos del usuario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-w-[900px]"
        >
          {/* Mostrar mensajes de error/éxito */}
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

          {/* Nombres */}
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nombres <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese su(s) Nombre(s)"
                    {...field}
                    maxLength={50}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellidos */}
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Apellidos <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese sus Apellidos"
                    {...field}
                    maxLength={50}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Documento Identidad */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-1">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Documento <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || loadingDocs}
                  >
                    <FormControl className="md:w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingDocs ? "Cargando..." : "Tipo"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((doc) => (
                        <SelectItem key={doc.id} value={String(doc.id)}>
                          {doc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-3">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Número <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de documento"
                      {...field}
                      maxLength={15}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Celular */}
          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Celular <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Ingrese su Celular"
                    {...field}
                    maxLength={12}
                    disabled={isLoading}
                  />
                </FormControl>
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Correo Electrónico <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Dirección
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese su dirección"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ubigeo: Departamento, Provincia, Distrito */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-2">
            {/* Departamento */}
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Departamento <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("provincia", "");
                      form.setValue("distrito", "");
                      handleDepartmentChange(value);
                    }}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.code} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Provincia */}
            <FormField
              control={form.control}
              name="provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Provincia <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("distrito", "");
                      handleProvinceChange(value);
                    }}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((prov) => (
                        <SelectItem key={prov.code} value={prov.code}>
                          {prov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Distrito */}
            <FormField
              control={form.control}
              name="distrito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Distrito <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDistrictChange(value);
                    }}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((dist) => (
                        <SelectItem key={dist.code} value={dist.code}>
                          {dist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Actualizando...
              </div>
            ) : (
              "Actualizar Perfil"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}