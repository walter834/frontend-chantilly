import { store } from "@/store/store";
import api from "../api";
import { loginAdminSuccess, logoutAdmin } from "@/store/slices/authAdminSlice";
import Cookies from 'js-cookie';

// Configuración de cookies seguras
const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 1 semana
} as const;

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

    // Guardar token y datos del usuario en cookies
    // Asegurarse de que las opciones se pasen correctamente
    const cookieOptions = {
      path: '/',
      sameSite: 'strict' as const,
      secure: process.env.NODE_ENV === 'production',
      expires: 7, // 7 días
    };
    
    Cookies.set(TOKEN_KEY, token, cookieOptions);
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);

    // Configurar el token en el encabezado de las peticiones
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    store.dispatch(loginAdminSuccess({ user, token }));

    return {
      success: true,
      message: message,
      user,
    };
  } catch (error) {
    // Limpiar cookies en caso de error
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
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
    const cookieOptions = {
      path: '/',
      sameSite: 'strict' as const,
      secure: process.env.NODE_ENV === 'production',
    };
    
    Cookies.remove(TOKEN_KEY, cookieOptions);
    Cookies.remove(USER_KEY, cookieOptions);
    
    delete api.defaults.headers.common['Authorization'];
    
    // Actualizar el estado global
    store.dispatch(logoutAdmin());
  }
};

/**
 * Verifica si hay una sesión activa y restaura el estado de autenticación
 * @returns Objeto con el estado de autenticación y datos del usuario si existe
 */
export const checkAuth = () => {
  const token = Cookies.get(TOKEN_KEY);
  const userData = Cookies.get(USER_KEY);

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      store.dispatch(loginAdminSuccess({ user, token }));
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Error al analizar los datos del usuario:', error);
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(USER_KEY);
    }
  }
  
  return { isAuthenticated: false, user: null };
};
