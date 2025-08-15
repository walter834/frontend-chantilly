// service/auth/authService.ts - VERSIÓN OPTIMIZADA SIN /customer
import api from "../api";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth";
import { store } from "@/store/store";
import { loginSuccess, logout } from "@/store/slices/authSlice";

// Interfaces de respuesta
interface LoginResponse {
  message: string;
  customer: User;
  token: string;
  token_type: string;
}

interface RegisterResponse {
  message: string;
  customer: User; // Cambiado de 'user' a 'customer'
  token?: string; // Opcional porque no parece venir en la respuesta
  type?: string; // Opcional
}

interface User {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  id_document_type?: number;
  document_number?: string;
  phone?: string;
  address?: string;
  deparment?: string;
  province?: string;
  district?: string;
  status?: number;
  google_id?: string | null;
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
  password_confirmation: string;
}

/**
 * Función para hacer login de usuario
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; message: string; customer?: User }> => {
  try {
    const response = await api.post<LoginResponse>("/login", credentials);
    const { token, customer, message } = response.data;

    // Guardar en Redux (Redux Persist automáticamente guarda en localStorage)
    store.dispatch(loginSuccess({ customer, token }));

    return {
      success: true,
      message: message || "Login exitoso",
      customer, // Devolver también los datos del customer
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
    // Intentar cerrar sesión en el backend
    await api.post("/logout");
  } catch (error) {
    console.warn("Error during logout API call:", error);
  } finally {
    // Redux Persist automáticamente limpia localStorage
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

    // Solo usar sessionStorage para redirection (es temporal)
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
 * OPCIÓN 1: Si tu backend envía los datos del customer en la URL
 */
export const handleAuthCallbackWithData = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    // Obtener datos del customer si vienen en los parámetros
    const customerDataParam = urlParams.get("customer");

    if (error) {
      console.error("Error en autenticación:", error);
      window.location.href = `/login?error=${encodeURIComponent(error)}`;
      return;
    }

    if (token && customerDataParam) {
      // Limpiar URL de parámetros
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        // Decodificar datos del customer
        const customer = JSON.parse(decodeURIComponent(customerDataParam));
        store.dispatch(loginSuccess({ customer, token }));
      } catch (parseError) {
        console.error("Error procesando datos del usuario:", parseError);
        window.location.href = "/login?error=parse_error";
        return;
      }

      // Obtener URL de redirección guardada o ir al home
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirigir
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
 * OPCIÓN 2: Si tu backend tiene un endpoint especial para obtener datos después de Google Auth
 * Por ejemplo: GET /auth/google/user con el token
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
      // Limpiar URL de parámetros
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        // Hacer llamada a endpoint específico para Google auth
        const response = await api.get<{ customer: User }>(
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

      // Obtener URL de redirección guardada o ir al home
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirigir
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

// Alias para la función que vayas a usar
export const handleAuthCallback = handleAuthCallbackWithData; // O handleAuthCallbackWithEndpoint

/**
 * Función para registrar un nuevo usuario
 */
export const register = async (formData: RegisterFormData) => {
  try {
    // Validar que las contraseñas coincidan antes de enviar
    if (formData.password !== formData.confirmPassword) {
      throw {
        success: false,
        message: "Las contraseñas no coinciden",
        status: 422,
        data: { errors: { password: ["Las contraseñas no coinciden"] } },
      };
    }

    // Mapear los datos del formulario al formato que espera la API Laravel
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
      password_confirmation: formData.confirmPassword,
    };

    const response = await api.post<RegisterResponse>("/customers", payload);
    const { customer, message } = response.data;

    // Para registro usamos user como customer

    return {
      success: true,
      message,
      customer,
    };
  } catch (error: any) {
    console.error("Error en registro completo:", error);

    // Manejar errores específicos de Laravel
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
 * Función para obtener tipos de documento
 */
export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  try {
    const response = await api.get<DocumentType[]>("/document-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching document types:", error);
    return [];
  }
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

    await api.get("/validate-token");
    return true;
  } catch (error) {
    console.log("Token inválido:", error);
    store.dispatch(logout());
    return false;
  }
};

/**
 * Función para obtener los datos del usuario logueado desde Redux
 * (sin hacer llamada a la API)
 */
export const getCurrentUserFromState = (): User | null => {
  const state = store.getState();

  if (!state.auth.isAuthenticated || !state.auth.token || !state.auth.name) {
    return null;
  }

  // Como no tenemos todos los datos del user en el state,
  // solo podemos devolver lo básico
  return {
    name: state.auth.name.split(" ")[0] || state.auth.name,
    lastname: state.auth.name.split(" ").slice(1).join(" ") || "",
    email: "", // No lo tenemos en el state
  };
};

/**
 * Función para cambiar contraseña
 */
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

/**
 * Función para recuperar contraseña
 */
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
    // 🔥 Agregar logs para debug
    console.log("🔍 Datos enviados al reset-password:", resetData);
    console.log("🔍 URL base de la API:", api.defaults.baseURL);

    // Asegurar que los datos estén limpios y coincidan exactamente con tu API
    const payload = {
      token: resetData.token.trim(),
      email: resetData.email.trim().toLowerCase(),
      password: resetData.password,
      password_confirmation: resetData.password_confirmation,
    };

    console.log("🔍 Payload limpio:", payload);

    const response = await api.post("/reset-password", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("✅ Respuesta exitosa:", response.data);

    return {
      success: true,
      message: response.data.message || "Contraseña restablecida exitosamente",
      data: response.data,
    };
  } catch (error: any) {
    // 🔥 Logs detallados del error
    console.error("❌ Error completo:", error);
    console.error("❌ Response data:", error.response?.data);
    console.error("❌ Response status:", error.response?.status);
    console.error("❌ Request config:", error.config);

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

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put(`/customers/${data.id}`, data);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Error al actualizar perfil",
    };
  }
};

// Tipos para exportar
export type { User, LoginCredentials, RegisterFormData };
