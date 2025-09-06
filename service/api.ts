import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { getCookie } from "@/lib/cookies";

export const API_ROUTES = {
  PAGES: "/pages",
  THEMES: "/theme",
  PRODUCTS: "/products",
  ACCESSORIES: "/products-accessories",
  PRODUCT_TYPES: "/product-types",
  CATEGORIES: "/categories",
  PRODUCTS_VARIANT: "/products-variant",
  CAKE_FLAVORS: "/cake-flavors",
  CUSTOMERS: "/customers",
  ORDERS: "/orders",
  // Legacy
  INIT_SESSION_NIUBIZ: "/session",
  // New Niubiz flow
  NIUBIZ_CONFIG: '/config',
  NIUBIZ_SESSION: '/session',
  NIUBIZ_PAY: '/pay',
  BANNER: '/banner',
  PAYMENT_DATA: '/payment-data',
  COMPLAINT: '/complaints',
} as const;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Obtener el token de las cookies si existe
const getTokenFromCookies = () => {
  return getCookie('auth_token') || null;
};

// Interceptor para incluir token automáticamente en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    
    // Primero intentar obtener el token de las cookies
    const tokenFromCookies = getTokenFromCookies();
    
    // Si hay un token en las cookies, usarlo
    if (tokenFromCookies) {
      config.headers.Authorization = `Bearer ${tokenFromCookies}`;
    } else {
      // Si no hay token en cookies, usar el del estado de Redux (para compatibilidad)
      const token = state.auth.token || state.authAdmin.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Configurar headers para JSON a menos que sea FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }

    return config;
  },
  (error) => {
    // Si el error es de autenticación (401), forzar cierre de sesión
    if (error.response && error.response.status === 401) {
      // Si hay un error 401, redirigir al login
      if (error.response?.status === 401) {
        // Las cookies se limpiarán en el próximo render
        store.dispatch(logout());
        window.location.href = '/admin/login';
      }
      store.dispatch(logout());
      // Redirigir a la página de login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, hacer logout automáticamente
      store.dispatch(logout());

      // Redirigir a login si no estamos ya ahí
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/")
      ) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
