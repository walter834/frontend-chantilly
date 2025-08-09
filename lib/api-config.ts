export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_ROUTES = {
  PAGES: '/pages',
  THEMES: '/theme',
  PRODUCTS: '/products',
  PRODUCT_TYPES: '/product-types',
  CATEGORIES: '/categories',
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
} as const;

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

export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

export const CACHE_CONFIG = {
  revalidate: 3600, 
  tags: ['pages', 'themes', 'products'],
};

export async function cachedApiRequest<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
} 