import api, { API_ROUTES } from './api';
import { 
  ApiProduct, 
  ApiProductsResponse, 
  ApiProductVariant, 
  ApiCakeFlavor, 
  ApiProductAccessory,
  TransformedProduct, 
  TransformedProductAccessory,
  TransformedProductVariant, 
  TransformedCakeFlavor, 
  transformProduct, 
  transformProductVariant, 
  transformCakeFlavor,
  transformProductAccessory 
} from '@/types/api';

export async function getProductById(id: number): Promise<TransformedProduct | null> {
  try {
    const endpoint = `${API_ROUTES.PRODUCTS}/${id}`;
    const { data } = await api.get<ApiProduct>(endpoint);
    return transformProduct(data);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<TransformedProduct | null> {
  try {
    const search = slug.replace(/-/g, ' ');
    const { products } = await fetchProducts(1, undefined, undefined, undefined, search);
    if (!products || products.length === 0) return null;

    const matched = products.find(p => {
      try {
        const url = new URL(p.product_link);
        const last = url.pathname.split('/').filter(Boolean).pop();
        return last === slug;
      } catch {

        return p.product_link.endsWith(slug) || p.product_link === slug;
      }
    }) || null;

    return matched || products[0] || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductVariantById(id: string, portion: string): Promise<TransformedProductVariant | null> {
  try {
    if(portion === "Elige una opción"){
      return null;
    }

    const endpoint = `${API_ROUTES.PRODUCTS_VARIANT}/${id}?portion_name=${portion}`;
    const { data } = await api.get<ApiProductVariant>(endpoint);
    return transformProductVariant(data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    console.error('Error fetching product variant by id:', error);
    return null;
  }
}

export async function getCakeFlavors(): Promise<TransformedCakeFlavor[]> {
  try {
    const endpoint = `${API_ROUTES.CAKE_FLAVORS}`;
    const { data } = await api.get<ApiCakeFlavor[]>(endpoint);
    return data.map(transformCakeFlavor);
  } catch (error) {
    console.error('Error fetching cake flavors:', error);
    return [];
  }
}

const THEME_SLUG_TO_ID: Record<string, number> = {
  'infantiles': 1,
  'mujer': 2,
  'hombre': 3,
  'bautizo': 4,
  'profesiones': 5,
  'enamorados': 6,
  'babyshower': 7,
};

export async function getProductsByTheme(
  themeSlug: string,
  page: number = 1,
  search?: string
): Promise<{
  products: TransformedProduct[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  const themeId = THEME_SLUG_TO_ID[themeSlug];
  return fetchProducts(page, undefined, themeId, undefined, search);
}

const CATEGORY_SLUG_TO_ID: Record<string, number> = {
    'tortas': 1,
    'tortas-tematicas': 2,
    'postres': 3,
    'bocaditos': 4,
    'promociones': 6,
};

export async function getProductsByCategory(
  categorySlug: string,
  page: number = 1,
  search?: string
): Promise<{
  products: TransformedProduct[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  const categoryId = CATEGORY_SLUG_TO_ID[categorySlug];
  return fetchProducts(page, categoryId, undefined, undefined, search);
}

export async function fetchProducts(
  page: number = 1,
  categoryId?: number,
  themeId?: number,
  productTypeId?: number,
  search?: string,
  bestStatus?: string,
): Promise<{
  products: TransformedProduct[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (categoryId) params.append('product_type_id', categoryId.toString());
    if (themeId) params.append('theme_id', themeId.toString());
    if (search) params.append('name', search);
    if (bestStatus) params.append('best_status', bestStatus);
    const endpoint = `${API_ROUTES.PRODUCTS}?${params.toString()}`;
    const { data: response } = await api.get<ApiProductsResponse>(endpoint);
    if (!response.data || !Array.isArray(response.data)) {
        return {
            products: [],
            pagination: {
                currentPage: 1,
                perPage: 12,
                total: 0,
                lastPage: 1,
                hasNextPage: false,
                hasPrevPage: false,
            },
        }
    };

    const transformedProducts = response.data.map(transformProduct);

    return {
      products: transformedProducts,
      pagination: {
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
        hasNextPage: !!response.next_page_url,
        hasPrevPage: !!response.prev_page_url,
      },
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        currentPage: 1,
        perPage: 12,
        total: 0,
        lastPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function fetchAccessories(): Promise<TransformedProductAccessory[]> {
  try {
    const endpoint = `${API_ROUTES.ACCESSORIES}`;
    const response = await api.get<{ accesorios: ApiProductAccessory[] }>(endpoint);
    
    if (response.data && Array.isArray(response.data.accesorios)) {
      return response.data.accesorios.map(transformProductAccessory);
    }
    
    console.warn('Unexpected API response format:', response);
    return [];
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return [];
  }
}


