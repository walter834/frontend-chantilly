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

interface Departamento {
  coddep: string;
  nomdep: string;
}

interface Provincia {
  codpro: string;
  nompro: string;
}

interface Distrito {
  coddis: string;
  nomdis: string;
}

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

  const [selectedDepCode, setSelectedDepCode] = useState("15"); // Lima por defecto
  const [selectedProCode, setSelectedProCode] = useState("01"); // Lima Metropolitana por defecto

  // Hooks de ubigeo
  const { departamentos } = useDepartamentos();
  const { provincias } = useProvincias(selectedDepCode);
  const { distritos } = useDistritos(selectedDepCode, selectedProCode);

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
    updateCustomerData,
  } = useAuth();

  // ✅ FUNCIONES AUXILIARES CON TIPADO CORRECTO
  const getDepartamentoName = (codigo: string): string => {
    return (
      (departamentos as Departamento[]).find((d) => d.coddep === codigo)
        ?.nomdep || ""
    );
  };

  const getProvinciaName = (codigo: string): string => {
    return (
      (provincias as Provincia[]).find((p) => p.codpro === codigo)?.nompro || ""
    );
  };

  const getDistritoName = (codigo: string): string => {
    return (
      (distritos as Distrito[]).find((d) => d.coddis === codigo)?.nomdis || ""
    );
  };

  // ✅ FUNCIÓN getDistrictName QUE ESTABA FALTANDO
  const getDistrictName = (nombreDistrito: string): string => {
    const distrito = (distritos as Distrito[]).find(
      (d) => d.nomdis === nombreDistrito
    );
    return distrito?.nomdis || nombreDistrito;
  };

  console.log("Customer data:", customer);

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
      provincia: "01",
      distrito: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Cargar tipos de documento (solo una vez)
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

  // Cargar datos iniciales SOLO UNA VEZ
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

      // Determinar códigos a usar
      let depCode = "15"; // Lima por defecto
      let proCode = "01"; // Lima por defecto
      let distCode = "";

      // Si el usuario tiene códigos guardados, usarlos
      if (customer.department_code) {
        depCode = customer.department_code;
        setSelectedDepCode(depCode);
      }
      if (customer.province_code) {
        proCode = customer.province_code;
        setSelectedProCode(proCode);
      }
      if (customer.district_code) {
        distCode = customer.district_code;
      }

      // Establecer valores en el formulario
      form.setValue("departamento", getDepartamentoName(depCode) || "Lima");
      form.setValue("provincia", getProvinciaName(proCode) || "Lima");
      form.setValue("distrito", distCode ? getDistritoName(distCode) : "");

      setIsLoadingForm(false);
      console.log("✅ Datos iniciales cargados");
    };

    if (departamentos.length > 0) {
      loadInitialData();
    }
  }, [
    departamentos.length,
    customer,
    isAuthenticated,
    name,
    lastname,
    documentType,
    documentNumber,
    phone,
    email,
    address,
    form,
  ]);

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
        deparment: "Lima",
        province: "Lima",
        district: getDistrictName(data.distrito),
        deparment_code: "15",
        province_code: "01",
        district_code: data.distrito,
      };

      // Solo incluir contraseña si se proporcionó
      if (data.password && data.password.trim()) {
        dataWithCodes.password = data.password.trim();
      }

      // Debug logs
      console.log("🔍 Debug - Formulario data.distrito:", data.distrito);
      console.log(
        "🔍 Debug - getDistrictName result:",
        getDistrictName(data.distrito)
      );
      console.log("🔍 Debug - dataWithCodes completo:", dataWithCodes);
      console.log("🔍 Debug - Códigos específicos:", {
        deparment_code: dataWithCodes.deparment_code,
        province_code: dataWithCodes.province_code,
        district_code: dataWithCodes.district_code,
      });
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
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c41d1ada]"></div>
          <span className="text-gray-600 text-sm">
            Cargando datos del perfil...
          </span>
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
                    onValueChange={(codigo) => {
                      // Actualizar estado local
                      setSelectedDepCode(codigo);
                      setSelectedProCode(""); // Reset provincia

                      // Actualizar formulario con nombre
                      const nombreDep = getDepartamentoName(codigo);
                      form.setValue("departamento", nombreDep);

                      // Resetear provincia y distrito
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
                      {(departamentos as Departamento[]).map((dep) => (
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
                      // Actualizar estado local
                      setSelectedProCode(codigo);

                      // Actualizar formulario con nombre
                      const nombreProv = getProvinciaName(codigo);
                      form.setValue("provincia", nombreProv);

                      // Resetear distrito
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
                      {(provincias as Provincia[]).map((prov) => (
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
                      // Actualizar formulario con nombre
                      const nombreDist = getDistritoName(codigo);
                      form.setValue("distrito", nombreDist);
                    }}
                    value={
                      (distritos as Distrito[]).find(
                        (d) => d.nomdis === form.watch("distrito")
                      )?.coddis || ""
                    }
                    disabled={isLoading || !selectedProCode}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar distrito" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(distritos as Distrito[]).map((dist) => (
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
