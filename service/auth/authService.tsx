// service/auth/authService.ts - VERSIÓN CORREGIDA
import api from "../api";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth";
import { store } from "@/store/store";
import { loginSuccess, logout, Customer } from "@/store/slices/authSlice";

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
  department: string;
  province: string;
  district: string;
  department_code: string;
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
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

/**
 * Función para hacer logout de usuario
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(logout());
  }
};

export const getUser = async (): Promise<Customer> => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener datos del usuario"
    );
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

    // Guardar URL de origen antes de redirigir
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      sessionStorage.setItem("redirectAfterLogin", currentUrl);
    }

    // ✅ CORREGIDO: Tu backend usa /auth/google/redirect (no /auth/google/callback)
    const googleAuthURL = `${baseURL}/auth/google/redirect`;

    window.location.href = googleAuthURL;
  } catch (error) {
    throw new Error(
      "No se pudo iniciar el proceso de autenticación con Google"
    );
  }
};

export const register = async (formData: RegisterFormData) => {
  try {
    if (formData.password !== formData.password_confirmation) {
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
      department: formData.departamento,
      province: formData.provincia,
      district: formData.distrito,
      department_code: formData.department_code,
      province_code: formData.province_code,
      district_code: formData.district_code,
      password_confirmation: formData.password_confirmation,
    };

    const response = await api.post<RegisterResponse>("/customers", payload);
    const { customer, message } = response.data;

    return {
      success: true,
      message,
      customer,
    };
  } catch (error: any) {
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
 Función para obtener los datos del customer desde Redux
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
    store.dispatch(logout());
    return false;
  }
};

export const updateProfile = async (
  data: Partial<Customer> & { id: number }
) => {
  try {
    const currentCustomer = getCurrentCustomer();
    const customerId = data.id || currentCustomer?.id;

    if (!customerId) {
      throw new Error("No se encontró el ID del customer");
    }

    // ✅ SIMPLE: Solo quitar el ID, enviar el resto tal como viene del componente
    const { id, ...dataToSend } = data;

    const response = await api.put(`/customers/${customerId}`, dataToSend);

    // Actualizar los datos en Redux con la respuesta del servidor
    if (response.data.customer) {
      const currentToken = store.getState().auth.token;
      if (currentToken) {
        store.dispatch(
          loginSuccess({
            customer: response.data.customer,
            token: currentToken,
          })
        );
      }
    }

    return {
      success: true,
      message: response.data.message || "Perfil actualizado exitosamente",
      customer: response.data.customer,
    };
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Error al actualizar perfil",
      status: error.response?.status,
    };
  }
};

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  try {
    const response = await api.get<DocumentType[]>("/document-types");
    return response.data;
  } catch (error) {
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

export type { Customer, LoginCredentials, RegisterFormData };
