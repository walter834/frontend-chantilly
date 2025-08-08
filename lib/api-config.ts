// Configuración de la API
export const API_BASE_URL = 'http://192.168.18.28:8000';

export const API_ROUTES = {
  PAGES: '/api/pages',
  THEMES: '/api/theme',
  PRODUCTS: '/api/products',
  PRODUCT_TYPES: '/api/product-types',
  CATEGORIES: '/api/categories',
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// Función genérica para hacer requests a la API
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {    
    headers: {
      ...API_HEADERS,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Funciones específicas para cada endpoint
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Configuración de caché
export const CACHE_CONFIG = {
  revalidate: 3600, // 1 hora
  tags: ['pages', 'themes', 'products'],
};

// Función para requests con caché
export async function cachedApiRequest<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
} 