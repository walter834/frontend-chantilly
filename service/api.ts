import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice"; // Cambia la importación

export const API_ROUTES = {
  PAGES: '/pages',
  THEMES: '/theme',
  PRODUCTS: '/products',
  ACCESSORIES: '/products-accessories',
  PRODUCT_TYPES: '/product-types',
  CATEGORIES: '/categories',
  PRODUCTS_VARIANT: '/products-variant',
  CAKE_FLAVORS: '/cake-flavors',
  CUSTOMERS: '/customers',
} as const;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para incluir token automáticamente en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;