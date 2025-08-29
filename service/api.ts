import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice"; // Cambia la importación

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
} as const;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para incluir token automáticamente en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const token = state.auth.token;
    const tokenAdmin = state.authAdmin.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tokenAdmin) {
      config.headers.Authorization = `Bearer ${tokenAdmin}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }

    return config;
  },
  (error) => {
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
