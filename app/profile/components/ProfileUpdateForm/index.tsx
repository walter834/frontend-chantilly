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
import {
  useDepartamentos,
  useDistritos,
  useProvincias,
} from "@/hooks/useUbigeo";
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

  // ✅ ESTADOS PARA MANEJAR LOS CÓDIGOS SELECCIONADOS
  const [selectedDepCode, setSelectedDepCode] = useState("");
  const [selectedProCode, setSelectedProCode] = useState("");
  const [selectedDistCode, setSelectedDistCode] = useState("");

  const { departamentos } = useDepartamentos();
  const { provincias } = useProvincias(selectedDepCode);
  const { distritos } = useDistritos(selectedDepCode, selectedProCode);

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
    updateCustomerData,
  } = useAuth();

  // ✅ FUNCIONES AUXILIARES UNIFICADAS (solo estas 3)
  const getDepartamentoName = (codigo: string) => {
    return departamentos.find((d: any) => d.coddep === codigo)?.nomdep || "";
  };

  const getProvinciaName = (codigo: string) => {
    return provincias.find((p: any) => p.codpro === codigo)?.nompro || "";
  };

  const getDistritoName = (codigo: string) => {
    return distritos.find((d: any) => d.coddis === codigo)?.nomdis || "";
  };

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
      password: "",
      password_confirmation: "",
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

  // ✅ CARGAR DATOS INICIALES CORREGIDO
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

      // ✅ LÓGICA MEJORADA PARA UBIGEO
      let depCode = customer.department_code || "15"; // Lima por defecto si no existe
      let proCode = customer.province_code || "01"; // Lima por defecto
      let distCode = customer.district_code || "";

      // Establecer códigos seleccionados
      setSelectedDepCode(depCode);
      setSelectedProCode(proCode);
      setSelectedDistCode(distCode);

      // Establecer valores NOMBRES en el formulario (para mostrar)
      form.setValue("departamento", getDepartamentoName(depCode));
      form.setValue("provincia", getProvinciaName(proCode));
      form.setValue("distrito", getDistritoName(distCode));

      setIsLoadingForm(false);
      console.log("✅ Datos iniciales cargados:", {
        depCode,
        proCode,
        distCode,
        depName: getDepartamentoName(depCode),
        proName: getProvinciaName(proCode),
        distName: getDistritoName(distCode),
      });
    };

    if (departamentos.length > 0) {
      loadInitialData();
    }
  }, [departamentos.length, customer, isAuthenticated]);

  // ✅ FUNCIÓN SUBMIT CORREGIDA
  const onSubmit = async (data: FormData) => {
    console.log("Customer completo:", customer);
    console.log("Códigos seleccionados:", {
      selectedDepCode,
      selectedProCode,
      selectedDistCode,
    });

    const userId = customer?.id || parseInt(id);
    if (!userId) {
      setSubmitError("No se puede identificar al usuario. Recargue la página.");
      return;
    }

    setIsLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      // ✅ ENVIAR CÓDIGOS EN LUGAR DE NOMBRES
      const dataWithCodes: any = {
        id: userId,
        name: data.nombres.trim(),
        lastname: data.apellidos.trim(),
        email: data.email.trim().toLowerCase(),
        id_document_type: parseInt(data.documentType),
        document_number: data.documentNumber.trim(),
        phone: data.celular.trim(),
        address: data.direccion?.trim() || "",

        // ✅ ENVIAR NOMBRES PARA COMPATIBILIDAD CON EL BACKEND
        department: getDepartamentoName(selectedDepCode),
        province: getProvinciaName(selectedProCode),
        district: getDistritoName(selectedDistCode),

        // ✅ ENVIAR CÓDIGOS CORRECTOS
        department_code: selectedDepCode,
        province_code: selectedProCode,
        district_code: selectedDistCode,
      };

      // Solo incluir contraseña si se proporcionó
      if (data.password) {
        dataWithCodes.password = data.password;
        dataWithCodes.password_confirmation = data.password_confirmation; // Corregido a confirmPassword
      }

      console.log("📤 Datos a enviar (CORREGIDOS):", dataWithCodes);
      console.log("📋 Códigos específicos:", {
        deparment_code: dataWithCodes.deparment_code,
        province_code: dataWithCodes.province_code,
        district_code: dataWithCodes.district_code,
      });

      const response = await updateProfile(dataWithCodes);
      console.log("✅ Respuesta del servidor:", response);

      if (response.customer) {
        updateCustomerData(response.customer);
        console.log("✅ Datos actualizados en Redux");
      }

      setSubmitSuccess(response.message || "Perfil actualizado exitosamente");

      // Limpiar campos de contraseña
      form.setValue("password", "");
      form.setValue("password_confirmation", "");

      setTimeout(() => {
        setSubmitSuccess("");
      }, 3000);
    } catch (error: unknown) {
      console.error("❌ Error completo:", error);

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

          {/* ✅ UBIGEO CORREGIDO */}
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
                    onValueChange={(codigo) => {
                      console.log("🏛️ Departamento seleccionado:", codigo);
                      // Actualizar estados
                      setSelectedDepCode(codigo);
                      setSelectedProCode(""); // Reset provincia
                      setSelectedDistCode(""); // Reset distrito

                      // Actualizar formulario con nombre
                      const nombreDep = getDepartamentoName(codigo);
                      form.setValue("departamento", nombreDep);
                      form.setValue("provincia", "");
                      form.setValue("distrito", "");
                    }}
                    value={selectedDepCode}
                    disabled={isLoading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departamentos.map((dep: any) => (
                        <SelectItem key={dep.coddep} value={dep.coddep}>
                          {dep.nomdep}
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
                    onValueChange={(codigo) => {
                      console.log("🏙️ Provincia seleccionada:", codigo);
                      // Actualizar estados
                      setSelectedProCode(codigo);
                      setSelectedDistCode(""); // Reset distrito

                      // Actualizar formulario con nombre
                      const nombreProv = getProvinciaName(codigo);
                      form.setValue("provincia", nombreProv);
                      form.setValue("distrito", "");
                    }}
                    value={selectedProCode}
                    disabled={isLoading || !selectedDepCode}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar provincia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provincias.map((prov: any) => (
                        <SelectItem key={prov.codpro} value={prov.codpro}>
                          {prov.nompro}
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
                    onValueChange={(codigo) => {
                      console.log("🏘️ Distrito seleccionado:", codigo);
                      // Actualizar estado
                      setSelectedDistCode(codigo);

                      // Actualizar formulario con nombre
                      const nombreDist = getDistritoName(codigo);
                      form.setValue("distrito", nombreDist);
                    }}
                    value={selectedDistCode}
                    disabled={isLoading || !selectedProCode}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar distrito" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {distritos.map((dist: any) => (
                        <SelectItem key={dist.coddis} value={dist.coddis}>
                          {dist.nomdis}
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
              name="password_confirmation"
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
