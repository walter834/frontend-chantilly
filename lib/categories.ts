import { 
  tortasProducts, 
  tortasTematicasProducts, 
  postresProducts, 
} from './products';
import { fetchPages, fetchThemes } from './api-services';

export interface CategoryInfo {
  title: string;
  description: string;
  products: any[];
  totalResults: number;
  currentResults: number;
  type: 'category' | 'subcategory';
  categoryName?: string;
  themes?: ThemeInfo[];
}

export interface ThemeInfo {
  id: string;
  title: string;
  description: string;
  products: any[];
  totalResults: number;
  currentResults: number;
  slug: string;
}

export interface ThemePageInfo {
  title: string;
  description: string;
  products: any[];
  totalResults: number;
  currentResults: number;
}

const tortasTematicasThemes: ThemeInfo[] = [
  {
    id: 'infantiles',
    title: 'TORTAS INFANTILES',
    description: 'Tortas temáticas para niños con diseños divertidos y coloridos.',
    products: tortasTematicasProducts.filter(p => p.name.includes('NIÑA') || p.name.includes('NIÑO')),
    totalResults: 2,
    currentResults: 2,
    slug: 'infantiles'
  },
  {
    id: 'mujer',
    title: 'TORTAS PARA MUJER',
    description: 'Tortas elegantes y sofisticadas para mujeres.',
    products: tortasTematicasProducts.filter(p => p.name.includes('MUJER')),
    totalResults: 1,
    currentResults: 1,
    slug: 'mujer'
  },
  {
    id: 'hombre',
    title: 'TORTAS PARA HOMBRE',
    description: 'Tortas con diseños masculinos y elegantes.',
    products: tortasTematicasProducts.filter(p => p.name.includes('HOMBRE')),
    totalResults: 1,
    currentResults: 1,
    slug: 'hombre'
  },
  {
    id: 'bautizo',
    title: 'TORTAS DE BAUTIZO',
    description: 'Tortas especiales para celebraciones de bautizo.',
    products: tortasTematicasProducts.slice(0, 2), // Ejemplo
    totalResults: 2,
    currentResults: 2,
    slug: 'bautizo'
  },
  {
    id: 'profesiones',
    title: 'TORTAS DE PROFESIONES',
    description: 'Tortas temáticas relacionadas con diferentes profesiones.',
    products: tortasTematicasProducts.slice(2, 4), // Ejemplo
    totalResults: 2,
    currentResults: 2,
    slug: 'profesiones'
  },
  {
    id: 'enamorados',
    title: 'TORTAS PARA ENAMORADOS',
    description: 'Tortas románticas para parejas enamoradas.',
    products: tortasTematicasProducts.filter(p => p.name.includes('LOVE') || p.name.includes('AMOR')),
    totalResults: 2,
    currentResults: 2,
    slug: 'enamorados'
  },
  {
    id: 'babyshower',
    title: 'TORTAS DE BABYSHOWER',
    description: 'Tortas especiales para celebraciones de babyshower.',
    products: tortasTematicasProducts.slice(4, 6), // Ejemplo
    totalResults: 2,
    currentResults: 2,
    slug: 'babyshower'
  }
];

export const categoryData: Record<string, CategoryInfo> = {
  'tortas': {
    title: 'TORTAS EN LINEA',
    description: 'Las mejores tortas en la Casa del Chantilly, calidad y amor.',
    products: tortasProducts,
    totalResults: tortasProducts.length,
    currentResults: tortasProducts.length,
    type: 'category'
  },
  'tortas-tematicas': {
    title: 'TORTAS TEMÁTICAS',
    description: 'Tortas personalizadas para ocasiones especiales con diseños únicos.',
    products: tortasTematicasProducts,
    totalResults: tortasTematicasProducts.length,
    currentResults: tortasTematicasProducts.length,
    type: 'subcategory',
    categoryName: 'Tortas',
    themes: tortasTematicasThemes
  },
  'promociones': {
    title: 'PROMOCIONES',
    description: 'Ofertas especiales y descuentos en nuestros productos.',
    products: [],
    totalResults: 0,
    currentResults: 0,
    type: 'category'
  },
  'postres': {
    title: 'POSTRES',
    description: 'Los mejores postres artesanales con ingredientes de calidad.',
    products: postresProducts,
    totalResults: postresProducts.length,
    currentResults: postresProducts.length,
    type: 'category'
  },
  'bocaditos': {
    title: 'BOCADITOS',
    description: 'Deliciosos bocaditos para cualquier ocasión.',
    products: [],
    totalResults: 0,
    currentResults: 0,
    type: 'category'
  }
};

export function getCategoryInfo(id: string): CategoryInfo | null {
  return categoryData[id] || null;
}

export function getThemeProducts(category: string, theme: string): ThemePageInfo | null {
  const categoryInfo = categoryData[category];
  if (!categoryInfo || !categoryInfo.themes) return null;

  const themeInfo = categoryInfo.themes.find(t => t.slug === theme);
  if (!themeInfo) return null;

  return {
    title: themeInfo.title,
    description: themeInfo.description,
    products: themeInfo.products,
    totalResults: themeInfo.totalResults,
    currentResults: themeInfo.currentResults
  };
}

export function getAllCategories(): string[] {
  return Object.keys(categoryData);
}

export function getCategoryThemes(category: string): ThemeInfo[] {
  const categoryInfo = categoryData[category];
  return categoryInfo?.themes || [];
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  try {
    const pages = await fetchPages();
    const themes = await fetchThemes();
    
    return Object.values(categoryData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback a datos estáticos
    return Object.values(categoryData);
  }
}

export async function fetchProducts(categoryId?: string, themeId?: string): Promise<any[]> {
  try {
    if (categoryId && themeId) {
      return getThemeProducts(categoryId, themeId)?.products || [];
    }
    if (categoryId) {
      return getCategoryInfo(categoryId)?.products || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    if (categoryId && themeId) {
      return getThemeProducts(categoryId, themeId)?.products || [];
    }
    if (categoryId) {
      return getCategoryInfo(categoryId)?.products || [];
    }
    return [];
  }
}

export async function fetchThemesFromAPI(categoryId: string): Promise<ThemeInfo[]> {
  try {
    const themes = await fetchThemes();
    return themes.map(theme => ({
      id: theme.id.toString(),
      title: theme.name,
      description: `Tortas temáticas de ${theme.name.toLowerCase()}`,
      products: [],
      totalResults: 0,
      currentResults: 0,
      slug: theme.slug
    }));
  } catch (error) {
    console.error('Error fetching themes:', error);
    return getCategoryThemes(categoryId);
  }
} 