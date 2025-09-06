import { store } from "@/store/store";
import api from "../api";
import { loginAdminSuccess, logoutAdmin } from "@/store/slices/authAdminSlice";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

// Configuración de cookies seguras
const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'Strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 1 semana en segundos
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

interface LoginAdminCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginAdminResponse {
  success: boolean;
  message: string;
  user: User;
}

export const loginAdmin = async (
  credentials: LoginAdminCredentials
): Promise<LoginAdminResponse> => {
  try {
    const response = await api.post("/admin/login", credentials);
    const { token, user, message } = response.data;

    await setCookie(TOKEN_KEY, token, {
      ...COOKIE_OPTIONS
    });
    
    await setCookie(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    store.dispatch(loginAdminSuccess({ user, token }));

    return {
      success: true,
      message: message || 'Inicio de sesión exitoso',
      user: user
    };
  } catch (error) {
    console.error('Error durante el login:', error);
    // Limpiar cookies en caso de error
    deleteCookie(TOKEN_KEY);
    deleteCookie(USER_KEY);
    throw error;
  }
};

export const logoutAdmins = async (): Promise<void> => {
  try {
    await api.post("/admin/logout");
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    throw error;
  } finally {
    await deleteCookie(TOKEN_KEY);
    await deleteCookie(USER_KEY);
    
    delete api.defaults.headers.common['Authorization'];
    
    // Actualizar el estado global
    store.dispatch(logoutAdmin());
  }
};

/**
 * Verifica si hay una sesión activa y restaura el estado de autenticación
 * @returns Objeto con el estado de autenticación y datos del usuario si existe
 */
export const checkAuth = async () => {
  const token = await getCookie(TOKEN_KEY);
  const userStr = await getCookie(USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      store.dispatch(loginAdminSuccess({ user, token }));
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Error al analizar los datos del usuario:', error);
await deleteCookie(TOKEN_KEY);
      await deleteCookie(USER_KEY);
    }
  }
  
  return { isAuthenticated: false, user: null };
};
