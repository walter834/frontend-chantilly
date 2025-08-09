import { apiGet, API_ROUTES } from './api-config';
import { 
  ApiPage, 
  ApiTheme, 
  ApiProductsResponse,
  TransformedPage, 
  TransformedTheme, 
  TransformedProduct,
  transformPage, 
  transformTheme,
  transformProduct
} from '@/types/api';

export async function fetchPages(): Promise<TransformedPage[]> {
  try {
    const apiPages: ApiPage[] = await apiGet(API_ROUTES.PAGES);
    
    const activePages = apiPages
      .filter(page => page.status)
      .sort((a, b) => a.orden - b.orden);
    
    return activePages.map(transformPage);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [
      { id: 1, name: 'NOVEDADES', slug: '', link: '/', orden: 1, status: true },
      { id: 2, name: 'TORTAS EN LINEA', slug: 'tortas', link: '/c/tortas', orden: 2, status: true },
      { id: 3, name: 'POSTRES', slug: 'postres', link: '/c/postres', orden: 5, status: true },
      { id: 4, name: 'BOCADITOS', slug: 'bocaditos', link: '/c/bocaditos', orden: 6, status: true },
      { id: 5, name: 'CONTACTANOS', slug: 'contactanos', link: '/contacto', orden: 7, status: true },
      { id: 6, name: 'TORTAS TEMATICAS', slug: 'tortas-tematicas', link: '/c/tortas-tematicas', orden: 3, status: true },
      { id: 7, name: 'PROMOCIONES', slug: 'promociones', link: '/c/promociones', orden: 4, status: true },
    ];
  }
}

export async function fetchThemes(): Promise<TransformedTheme[]> {
  try {
    const apiThemes: ApiTheme[] = await apiGet(API_ROUTES.THEMES);
    
    return apiThemes.map(transformTheme);
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [
      { id: 1, name: 'INFANTILES', slug: 'infantiles', icon: '/imgs/icons/iconos-05.png', link: '/c/tortas-tematicas/infantiles' },
      { id: 2, name: 'MUJER', slug: 'mujer', icon: '/imgs/icons/iconos-03.png', link: '/c/tortas-tematicas/mujer' },
      { id: 3, name: 'HOMBRE', slug: 'hombre', icon: '/imgs/icons/iconos-04.png', link: '/c/tortas-tematicas/hombre' },
      { id: 4, name: 'BAUTIZO', slug: 'bautizo', icon: '/imgs/icons/iconos-07.png', link: '/c/tortas-tematicas/bautizo' },
      { id: 5, name: 'PROFESIONES', slug: 'profesiones', icon: '/imgs/icons/iconos-06.png', link: '/c/tortas-tematicas/profesiones' },
      { id: 6, name: 'ENAMORADOS', slug: 'enamorados', icon: '/imgs/icons/iconos-13.png', link: '/c/tortas-tematicas/enamorados' },
      { id: 7, name: 'BABYSHOWER', slug: 'babyshower', icon: '/imgs/icons/iconos-10.png', link: '/c/tortas-tematicas/babyshower' },
    ];
  }
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
    
    if (categoryId) {
      params.append('category_id', categoryId.toString());
    }
    
    if (themeId) {
      params.append('theme_id', themeId.toString());
    }
    
    if (productTypeId) {
      params.append('product_type_id', productTypeId.toString());
    }
    
    if (search) {
      params.append('name', search);
    }

    if(bestStatus){
      params.append('best_status', bestStatus.toString());
    }

    console.log('parametros', params.toString());

    const endpoint = `${API_ROUTES.PRODUCTS}?${params.toString()}`;
    const response: ApiProductsResponse = await apiGet(endpoint);

    if(response.message){
      return {
        products: [],
        pagination: {
          currentPage: 1,
          perPage: 8,
          total: 0,
          lastPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      };
    }
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
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        currentPage: 1,
        perPage: 8,
        total: 0,
        lastPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}

export async function getPageBySlug(slug: string): Promise<TransformedPage | null> {
  try {
    const pages = await fetchPages();
    return pages.find(page => page.slug === slug) || null;
  } catch (error) {
    console.error('Error getting page by slug:', error);
    return null;
  }
}

export async function getThemeBySlug(slug: string): Promise<TransformedTheme | null> {
  try {
    const themes = await fetchThemes();
    return themes.find(theme => theme.slug === slug) || null;
  } catch (error) {
    console.error('Error getting theme by slug:', error);
    return null;
  }
}

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
  try {
    const categoryMap: Record<string, number> = {
      'tortas': 1,
      'tortas-tematicas': 2,
      'postres': 3,
      'bocaditos': 4,
      'promociones': 6,
    };
    
    const productTypeId = categoryMap[categorySlug];
    if (!productTypeId) {
      throw new Error(`Category not found: ${categorySlug}`);
    }
    
    return await fetchProducts(page, undefined, undefined, productTypeId, search);
  } catch (error) {
    console.error('Error getting products by category:', error);
    return {
      products: [],
      pagination: {
        currentPage: 1,
        perPage: 8,
        total: 0,
        lastPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}

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
try {
const themes = await fetchThemes();
const theme = themes.find(t => t.slug === themeSlug);
  
if (!theme) {
throw new Error(`Theme with slug "${themeSlug}" not found`);
}

const response: ApiProductsResponse = await apiGet(
`${API_ROUTES.PRODUCTS}?page=${page}&theme_id=${theme.id}${search ? `&search=${encodeURIComponent(search)}` : ''}`
);

return {
products: response.data.map(transformProduct),
pagination: {
currentPage: response.current_page,
perPage: response.per_page,
total: response.total,
lastPage: response.last_page,
hasNextPage: response.current_page < response.last_page,
hasPrevPage: response.current_page > 1,
},
};
} catch (error) {
console.error('Error fetching products by theme:', error);
return {
products: [],
pagination: {
currentPage: 1,
perPage: 10,
total: 0,
lastPage: 1,
hasNextPage: false,
hasPrevPage: false,
},
};
}
}

export async function getProductById(id: string): Promise<TransformedProduct | null> {
  try {
    const response: any = await apiGet(`${API_ROUTES.PRODUCTS}/${id}`);
    return transformProduct(response);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}