"use client";

import { useEffect, useState, useRef } from "react";
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
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { getDocumentTypes, updateProfile } from "@/service/auth/authService";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useAuth } from "@/hooks/useAuth";
import { profileUpdateSchema } from "@/lib/validators/auth";

type FormData = z.infer<typeof profileUpdateSchema>;

interface ProfileUpdateFormProps {
  id: string;
}

export default function ProfileUpdateForm({ id }: ProfileUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Flag para controlar si ya se cargaron los datos iniciales
  const initialDataLoaded = useRef(false);

  const {
    customer,
    isAuthenticated,
    name,
    lastname,
    email,
    phone,
    address,
    documentNumber,
    documentType,
    department,
    province,
    district,
    updateCustomerData,
  } = useAuth();
  console.log(customer);
  
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
      departamento: "15",
      provincia: "1501",
      distrito: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ✅ Cargar tipos de documento (solo una vez)
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

  // ✅ Cargar datos iniciales SOLO UNA VEZ
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated || !customer || initialDataLoaded.current) return;

      console.log("✅ Cargando datos iniciales del formulario...");
      initialDataLoaded.current = true;

      // Cargar datos básicos
      form.setValue("nombres", name || "");
      form.setValue("apellidos", lastname || "");
      form.setValue("documentType", String(documentType) || "");
      form.setValue("documentNumber", documentNumber || "");
      form.setValue("celular", phone || "");
      form.setValue("email", email || "");
      form.setValue("direccion", address || "");
      form.setValue("departamento", "15");
      form.setValue("provincia", "1501");

      // Inicializar Lima en el hook
      await handleDepartmentChange("15");
      await new Promise((resolve) => setTimeout(resolve, 100));
      await handleProvinceChange("1501");
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Cargar distrito si está disponible
      if (customer.district_code) {
        console.log("Cargando distrito desde BD:", customer.district_code);
        form.setValue("distrito", customer.district_code);
        handleDistrictChange(customer.district_code);
      } else {
        console.log("No hay distrito en BD, quedará vacío para seleccionar");
        form.setValue("distrito", "");
      }

      setIsLoadingForm(false);
      console.log("✅ Datos iniciales cargados");
    };

    if (departments.length > 0) {
      loadInitialData();
    }
  }, [departments.length, customer, isAuthenticated]);

  // Si los departamentos se cargan después, completar la carga
  useEffect(() => {
    if (departments.length > 0 && !initialDataLoaded.current && customer) {
      // Trigger el efecto anterior
      setIsLoadingForm(true);
    }
  }, [departments.length, customer]);

  const onSubmit = async (data: FormData) => {
    // Agregar estos logs al inicio
    console.log("Customer completo:", customer);
    console.log("Customer ID:", customer?.id);
    console.log("Props ID:", id);

    // Verificar que tenemos un ID válido
    const userId = customer?.id || parseInt(id);
    if (!userId) {
      setSubmitError("No se puede identificar al usuario. Recargue la página.");
      return;
    }
    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      console.log("Datos del formulario (códigos):", data);

      const dataWithCodes: any = {
        id: userId,
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
        deparment_code: "15",
        province_code: "1501",
        district_code: data.distrito,
      };

      // Solo incluir contraseña si se proporcionó
      if (data.password && data.password.trim()) {
        dataWithCodes.password = data.password.trim();
      }

      console.log("Datos convertidos para envío:", dataWithCodes);

      const response = await updateProfile(dataWithCodes);
      console.log("Respuesta del servidor:", response);

      if (response.customer) {
        updateCustomerData(response.customer);
        console.log("✅ Datos actualizados en Redux");
      }

      setSubmitSuccess(response.message || "Perfil actualizado exitosamente");

      // Limpiar campos de contraseña después del éxito
      form.setValue("password", "");
      form.setValue("confirmPassword", "");

      setTimeout(() => {
        setSubmitSuccess("");
      }, 3000);
    } catch (error: unknown) {
      console.error("Error completo:", error);

      let errorMessage = "Error al actualizar perfil";

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

  if (!isAuthenticated || !customer) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <span>
            No se encontraron datos del usuario. Por favor, inicie sesión
            nuevamente.
          </span>
        </div>
      </div>
    );
  }

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando formulario...</span>
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
          {/* Mensajes de error/éxito */}
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
                    onValueChange={async (value) => {
                      field.onChange(value);
                      // Limpiar provincia y distrito sin resetear todo el form
                      form.setValue("provincia", "");
                      form.setValue("distrito", "");
                      await handleDepartmentChange(value);
                    }}
                    value={field.value}
                    disabled={true}
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
                    onValueChange={async (value) => {
                      field.onChange(value);
                      // Solo limpiar distrito
                      form.setValue("distrito", "");
                      await handleProvinceChange(value);
                    }}
                    value={field.value}
                    disabled={true}
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

          {/* Campos de contraseña opcionales */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nueva Contraseña{" "}
                    <span className="text-gray-400">(Opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Dejar vacío para mantener actual"
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
                    Confirmar Nueva Contraseña{" "}
                    <span className="text-gray-400">(Opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar nueva contraseña"
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
