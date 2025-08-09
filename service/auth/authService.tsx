// service/auth/authService.ts

import api from "../api";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth";
import { setCookie } from "@/lib/utils/cookies";
import { store } from "@/store/store";
import { login, logout } from "@/store/slices/authSlice";

// Interfaces de respuesta
interface LoginResponse {
  message: string;
  user: User;
  token: string;
  type: string;
}

interface RegisterResponse {
  message: string;
  user: User;
  token: string;
  type: string;
}

// Tipos para el formulario
type RegisterFormData = z.infer<typeof registerSchema>;

// Interfaz para el payload que se envía a la API (formato Laravel)
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
  identifier: string,
  password: string,
  remember: boolean = false
): Promise<LoginResponse> => {
  try {
    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { user: identifier, password };

    const response = await api.post<LoginResponse>("/login", payload);
    const { token, user } = response.data;

    // Validar que tengamos los datos necesarios
    if (!token || !user) {
      throw new Error(
        "Respuesta del servidor incompleta - faltan token o datos de usuario"
      );
    }

    setCookie("token", token, 1);
    store.dispatch(login({ user, remember }));

    return response.data;
  } catch (error: unknown) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función principal para login con Google (redirección completa)
export const loginWithGoogle = () => {
  try {
    const baseURL = api.defaults.baseURL;

    if (!baseURL) {
      throw new Error("baseURL no está configurado en la instancia de api");
    }

    // Guardar la URL actual para redirigir después del login (opcional)
    localStorage.setItem("redirectAfterLogin", window.location.href);

    // Construir la URL con parámetro de redirección
    // En googleLogin.js, cambiar esta línea:
    const redirectURL = encodeURIComponent(
      `${baseURL}/auth/google/callback`
    );
    const googleAuthURL = `${baseURL}/auth/google/redirect?redirect_uri=${redirectURL}`;

    // Redirigir al usuario al endpoint de Google OAuth
    window.location.href = googleAuthURL;
  } catch (error) {
    console.error("Error al iniciar login con Google:", error);
    throw new Error(
      "No se pudo iniciar el proceso de autenticación con Google"
    );
  }
};

// Función para manejar el callback después del login
export const handleAuthCallback = () => {
  try {
    // Obtener token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      console.error("Error en autenticación:", error);
      // Redirigir al login con mensaje de error
      window.location.href = `/login?error=${encodeURIComponent(error)}`;
      return;
    }

    if (token) {
      // Guardar token en cookie (como lo usa tu configuración)
      setCookie("token", token, 7); // 7 días de expiración

      // Limpiar URL de parámetros
      window.history.replaceState({}, document.title, window.location.pathname);

      // Obtener URL de redirección guardada o ir al home
      const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");

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
 * Función para registrar un nuevo usuario - CORREGIDA
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
      password_confirmation: formData.confirmPassword, // ✅ AGREGAR ESTE CAMPO
    };

    console.log("Payload enviado a la API:", payload); // Debug

    const response = await api.post<RegisterResponse>("/customers", payload);
    const { token, user, message } = response.data;

    // Guardar token y usuario en el estado global
    setCookie("token", token, 1);
    store.dispatch(login({ user, remember: true }));

    return {
      success: true,
      message,
      user,
    };
  } catch (error: any) {
    console.error("Error en registro completo:", error);

    // Manejar errores específicos de Laravel
    let errorMessage = "Error al registrar usuario";
    let validationErrors = {};

    if (error.response?.status === 422) {
      // Errores de validación de Laravel
      errorMessage =
        error.response?.data?.message || "Datos de validación incorrectos";
      validationErrors = error.response?.data?.errors || {};

      // Formatear errores de validación para mostrar
      const errorMessages = Object.values(validationErrors).flat();
      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join(", ");
      }
    } else if (error.response?.status === 409) {
      errorMessage = "El usuario ya existe";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || "Datos inválidos";
    } else if (error.message && !error.response) {
      // Error personalizado que lanzamos arriba
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
 * Función para obtener el usuario actual
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ user: User }>("/user");
    const user = response.data.user;

    console.log("getCurrentUser response:", user);
    store.dispatch(login({ user, remember: true }));

    return user;
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
};

/**
 * Función para validar si el token es válido
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    await api.get("/validate-token");
    return true;
  } catch (error) {
    console.log("Token inválido:", error);
    store.dispatch(logout());
    return false;
  }
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
