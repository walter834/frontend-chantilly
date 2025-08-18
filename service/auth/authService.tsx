// service/auth/authService.ts - VERSIÓN CORREGIDA
import api from "../api";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth";
import { store } from "@/store/store";
import { loginSuccess, logout, Customer } from "@/store/slices/authSlice";

// Interfaces de respuesta
interface LoginResponse {
  message: string;
  customer: Customer;
  token: string;
  token_type: string;
}

interface RegisterResponse {
  message: string;
  customer: Customer;
  token?: string;
  type?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterPayload {
  email: string;
  password: string;
  id_document_type: number;
  document_number: string;
  name: string;
  lastname: string;
  address: string;
  phone: string;
  deparment: string;
  province: string;
  district: string;
  deparment_code: string;
  province_code: string;
  district_code: string;
  password_confirmation: string;
}

/**
 * Función para hacer login de usuario
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; message: string; customer?: Customer }> => {
  try {
    const response = await api.post<LoginResponse>("/login", credentials);
    const { token, customer, message } = response.data;

    // Guardar en Redux con todos los datos del customer
    store.dispatch(loginSuccess({ customer, token }));

    return {
      success: true,
      message: message || "Login exitoso",
      customer,
    };
  } catch (error: any) {
    console.error("Error en login:", error);

    const errorMessage =
      error.response?.data?.message || "Error al iniciar sesión";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Función para hacer logout de usuario
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.warn("Error during logout API call:", error);
  } finally {
    store.dispatch(logout());
  }
};

/**
 * Función principal para login con Google
 */
export const loginWithGoogle = () => {
  try {
    const baseURL = api.defaults.baseURL;

    if (!baseURL) {
      throw new Error("baseURL no está configurado en la instancia de api");
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectAfterLogin", window.location.href);
    }

    const redirectURL = encodeURIComponent(`${baseURL}/auth/google/callback`);
    const googleAuthURL = `${baseURL}/auth/google/redirect?redirect_uri=${redirectURL}`;

    window.location.href = googleAuthURL;
  } catch (error) {
    console.error("Error al iniciar login con Google:", error);
    throw new Error(
      "No se pudo iniciar el proceso de autenticación con Google"
    );
  }
};

/**
 * Función para manejar el callback después del login con Google
 */
export const handleAuthCallbackWithData = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");
    const customerDataParam = urlParams.get("customer");

    if (error) {
      console.error("Error en autenticación:", error);
      window.location.href = `/login?error=${encodeURIComponent(error)}`;
      return;
    }

    if (token && customerDataParam) {
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const customer: Customer = JSON.parse(
          decodeURIComponent(customerDataParam)
        );
        store.dispatch(loginSuccess({ customer, token }));
        console.log("aswesome", customer);
      } catch (parseError) {
        console.error("Error procesando datos del usuario:", parseError);
        window.location.href = "/login?error=parse_error";
        return;
      }

      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectUrl;
    } else {
      console.error("No se recibió token o datos del customer");
      window.location.href = "/login?error=missing_data";
    }
  } catch (error) {
    console.error("Error procesando callback:", error);
    window.location.href = "/login?error=callback_error";
  }
};

/**
 * Función alternativa para callback con endpoint
 */
export const handleAuthCallbackWithEndpoint = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      console.error("Error en autenticación:", error);
      window.location.href = `/login?error=${encodeURIComponent(error)}`;
      return;
    }

    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const response = await api.get<{ customer: Customer }>(
          "/auth/google/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const customer = response.data.customer;
        store.dispatch(loginSuccess({ customer, token }));
      } catch (apiError) {
        console.error("Error obteniendo datos del usuario:", apiError);
        window.location.href = "/login?error=user_fetch_error";
        return;
      }

      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectUrl;
    } else {
      console.error("No se recibió token en el callback");
      window.location.href = "/login?error=no_token";
    }
  } catch (error) {
    console.error("Error procesando callback:", error);
    window.location.href = "/login?error=callback_error";
  }
};

export const handleAuthCallback = handleAuthCallbackWithData;

/**
 * Función para registrar un nuevo usuario
 */
export const register = async (formData: RegisterFormData) => {
  try {
    if (formData.password !== formData.confirmPassword) {
      throw {
        success: false,
        message: "Las contraseñas no coinciden",
        status: 422,
        data: { errors: { password: ["Las contraseñas no coinciden"] } },
      };
    }

    const payload: RegisterPayload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      id_document_type: parseInt(formData.documentType),
      document_number: formData.documentNumber.trim(),
      name: formData.nombres.trim(),
      lastname: formData.apellidos.trim(),
      address: formData.direccion?.trim() || "",
      phone: formData.celular.trim(),
      deparment: formData.departamento,
      province: formData.provincia,
      district: formData.distrito,
      deparment_code: formData.deparment_code,
      province_code: formData.province_code,
      district_code: formData.district_code,
      password_confirmation: formData.confirmPassword,
    };

    const response = await api.post<RegisterResponse>("/customers", payload);
    const { customer, message } = response.data;

    return {
      success: true,
      message,
      customer,
    };
  } catch (error: any) {
    console.error("Error en registro completo:", error);

    let errorMessage = "Error al registrar usuario";
    let validationErrors = {};

    if (error.response?.status === 422) {
      errorMessage =
        error.response?.data?.message || "Datos de validación incorrectos";
      validationErrors = error.response?.data?.errors || {};

      const errorMessages = Object.values(validationErrors).flat();
      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join(", ");
      }
    } else if (error.response?.status === 409) {
      errorMessage = "El usuario ya existe";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || "Datos inválidos";
    } else if (error.message && !error.response) {
      errorMessage = error.message;
    }

    throw {
      success: false,
      message: errorMessage,
      status: error.response?.status || error.status,
      data: error.response?.data || error.data,
      validationErrors,
    };
  }
};

/**
 * ✅ CORREGIDA: Función para obtener los datos del customer desde Redux
 * Ya no necesita hacer petición a API porque no existe endpoint /me
 */
export const getCurrentCustomer = (): Customer | null => {
  const state = store.getState();

  if (
    !state.auth.isAuthenticated ||
    !state.auth.token ||
    !state.auth.customer
  ) {
    return null;
  }

  return state.auth.customer;
};

/**
 * ✅ Función alternativa con nombre más descriptivo (igual funcionalidad)
 */
export const getCurrentCustomerFromState = (): Customer | null => {
  return getCurrentCustomer();
};

/**
 * Función para validar si el token es válido
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    const state = store.getState();
    const token = state.auth.token;

    if (!token) {
      return false;
    }

    // Si tienes un endpoint para validar token, úsalo aquí
    // Si no, puedes comentar esta línea y solo validar que exista el token
    await api.get("/validate-token");
    return true;
  } catch (error) {
    console.log("Token inválido:", error);
    store.dispatch(logout());
    return false;
  }
};

/**
 * ✅ Función para actualizar perfil completa
 */
export const updateProfile = async (data: Partial<Customer>) => {
  try {
    const currentCustomer = getCurrentCustomer();
    console.log("datos del usuario", currentCustomer);

    if (!currentCustomer?.id) {
      throw new Error("No se encontró el ID del customer");
    }

    console.log(`🔍 Actualizando customer ID: ${currentCustomer.id}`);

    const response = await api.put(`/customers/${currentCustomer.id}`, data);
    console.log("Response del update:", response);

    // Actualizar los datos en Redux con la respuesta del servidor
    if (response.data.customer) {
      store.dispatch(
        loginSuccess({
          customer: response.data.customer,
          token: store.getState().auth.token!,
        })
      );
    }

    return {
      success: true,
      message: response.data.message,
      customer: response.data.customer,
    };
  } catch (error: any) {
    const currentCustomer = getCurrentCustomer();
    console.error(
      `❌ Error actualizando customer ID ${currentCustomer?.id}:`,
      error
    );
    throw {
      success: false,
      message: error.response?.data?.message || "Error al actualizar perfil",
    };
  }
};

/**
 * ✅ NUEVA: Función para refrescar datos del customer después de una actualización
 * Si tu API devuelve los datos actualizados en algún endpoint, puedes usar esta función
 */
export const refreshCustomerData = async (): Promise<Customer | null> => {
  try {
    const currentCustomer = getCurrentCustomer();

    if (!currentCustomer?.id) {
      return null;
    }

    // Si tienes un endpoint para obtener customer por ID, úsalo aquí
    // const response = await api.get(`/customers/${currentCustomer.id}`);
    // const updatedCustomer = response.data.customer;

    // Por ahora, devolvemos los datos que ya tenemos en Redux
    return currentCustomer;
  } catch (error) {
    console.error("Error refrescando datos del customer:", error);
    return getCurrentCustomer();
  }
};

// Resto de funciones...
export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  try {
    const response = await api.get<DocumentType[]>("/document-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching document types:", error);
    return [];
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });

    return {
      success: true,
      message: response.data.message || "Contraseña cambiada exitosamente",
    };
  } catch (error: any) {
    console.error("Error al cambiar contraseña:", error);

    const errorMessage =
      error.response?.data?.message || "Error al cambiar contraseña";

    throw {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/forgot-password", { email });

    return {
      success: true,
      message:
        response.data.message ||
        "Se ha enviado un correo para recuperar tu contraseña",
    };
  } catch (error: any) {
    console.error("Error en recuperación de contraseña:", error);

    const errorMessage =
      error.response?.data?.message || "Error al enviar correo de recuperación";

    throw {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

export const ResetPassword = async (resetData: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const payload = {
      token: resetData.token.trim(),
      email: resetData.email.trim().toLowerCase(),
      password: resetData.password,
      password_confirmation: resetData.password_confirmation,
    };

    const response = await api.post("/reset-password", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return {
      success: true,
      message: response.data.message || "Contraseña restablecida exitosamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("❌ Error completo:", error);

    const errorMessage =
      error.response?.data?.message || "Error al restablecer la contraseña";

    throw {
      success: false,
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
  }
};

// Exportar tipos
export type { Customer, LoginCredentials, RegisterFormData };
