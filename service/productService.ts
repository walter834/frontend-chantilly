import { toast } from "sonner";

export async function getProductById(id: string): Promise<TransformedProduct | null> {
  try {
    const endpoint = `${API_ROUTES.PRODUCTS}/${id}`;
    const { data } = await api.get<ApiProduct>(endpoint);
    return transformProduct(data);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
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
 console.log('here1')
  const categoryId = CATEGORY_SLUG_TO_ID[categorySlug];
  return fetchProducts(page, categoryId, undefined, undefined, search);
}
import api, { API_ROUTES } from './api';
import {
  ApiProduct,
  ApiProductsResponse,
  TransformedProduct,
  transformProduct,
} from '@/types/api';

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
        console.log('data', response.data)
    if (!response.data || !Array.isArray(response.data)) {
        toast.error("No se encotraron productos", {position: "top-right"});
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
