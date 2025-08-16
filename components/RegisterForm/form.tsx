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
import { Eye, EyeOff, Home, AlertCircle, CheckCircle } from "lucide-react";
import { registerSchema } from "@/lib/validators/auth";
import { getDocumentTypes, register } from "@/service/auth/authService";
import { useUbigeo } from "@/hooks/useUbigeo";

type FormData = z.infer<typeof registerSchema>;

interface RegisterProps {
  onBackToLogin?: () => void;
  onCloseDialog?: () => void;
  onGoToLogin?: () => void;
}

export default function Register({
  onBackToLogin,
  onGoToLogin,
}: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

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

  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
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
      password: "",
      deparment_code:"",
      province_code: "",
      district_code: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      console.log("Datos del formulario (códigos):", data);

      // ✅ CONVERSIÓN: Convertir códigos a nombres antes de enviar
      const dataWithCodesAndNames = {
        ...data,
        departamento: getDepartmentName(data.departamento), // nombre
        provincia: getProvinceName(data.provincia), // nombre
        distrito: getDistrictName(data.distrito), // nombre
        deparment_code: data.departamento,                   
      province_code: data.provincia,                       
      district_code: data.distrito,                        
      };

      console.log("Datos convertidos a nombres:", dataWithCodesAndNames);

      const response = await register(dataWithCodesAndNames);

      console.log("Respuesta del servidor:", response);
      console.log("Registro exitoso:", response.message);
      setSubmitSuccess(response.message || "Usuario registrado exitosamente");

      // Esperar un poco antes de cerrar para mostrar el mensaje de éxito
      setTimeout(() => {
        onGoToLogin?.();
      }, 1000);
    } catch (error: unknown) {
      console.error("Error completo:", error);

      let errorMessage = "Error al registrar usuario";

      if (error && typeof error === "object") {
        const err = error as { status?: number; message?: string };
        if (err.status === 422) {
          errorMessage =
            err.message || "Error de validación. Revise los datos ingresados.";
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

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Form */}
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
          <div className="flex flex-col gap-3  md:grid md:grid-cols-3 md:gap-2">
            {/* Departamento */}
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 ">
                    Departamento <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      // Resetea provincia y distrito en el formulario y en el hook
                      form.setValue("provincia", "");
                      form.setValue("distrito", "");

                      handleDepartmentChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={"Seleccionar"} />
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
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={"Seleccionar"} />
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

          {/* Password fields */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        {...field}
                        className="pr-10"
                        disabled={isLoading}
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirmar <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar"
                        {...field}
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
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
                Registrando...
              </div>
            ) : (
              "Registrarse"
            )}
          </Button>

          {/* Sign in link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-purple-600 hover:text-purple-800 font-medium"
                disabled={isLoading}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
