import { fetchPages, fetchThemes, fetchProducts as apiFetchProducts } from './api-services';
import { TransformedProduct } from '@/types/api';

export interface CategoryInfo {
  title: string;
  description: string;
  products: TransformedProduct[];
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
  products: TransformedProduct[];
  totalResults: number;
  currentResults: number;
  slug: string;
}

export interface ThemePageInfo {
  title: string;
  description: string;
  products: TransformedProduct[];
  totalResults: number;
  currentResults: number;
}

// Configuración básica de categorías (solo metadatos, sin productos estáticos)
const categoryData: Record<string, Omit<CategoryInfo, 'products' | 'totalResults' | 'currentResults'>> = {
  'tortas': {
    title: 'TORTAS EN LÍNEA',
    description: 'Las mejores tortas en la Casa del Chantilly, calidad y amor.',
    type: 'category'
  },
  'tortas-tematicas': {
    title: 'TORTAS TEMÁTICAS',
    description: 'Las mejores tortas temáticas en la Casa del Chantilly, calidad y amor.',
    type: 'category'
  },
  'promociones': {
    title: 'PROMOCIONES',
    description: 'Las mejores promociones en la Casa del Chantilly, calidad y amor.',
    type: 'category'
  },
  'postres': {
    title: 'POSTRES',
    description: 'Los mejores postres en la Casa del Chantilly, calidad y amor.',
    type: 'category'
  },
  'bocaditos': {
    title: 'BOCADITOS',
    description: 'Los mejores bocaditos en la Casa del Chantilly, calidad y amor.',
    type: 'category'
  }
};

export function getCategoryInfo(id: string): Omit<CategoryInfo, 'products' | 'totalResults' | 'currentResults'> | null {
  return categoryData[id] || null;
}

export async function getCategoryWithProducts(id: string): Promise<CategoryInfo | null> {
  try {
    const category = categoryData[id];
    if (!category) return null;

    const result = await apiFetchProducts(1, undefined, undefined, undefined, undefined);
    
    return {
      ...category,
      products: result.products || [],
      totalResults: result.pagination?.total || 0,
      currentResults: result.products?.length || 0
    };
  } catch (error) {
    console.error('Error fetching category info:', error);
    const category = categoryData[id];
    if (!category) return null;
    
    return {
      ...category,
      products: [],
      totalResults: 0,
      currentResults: 0
    };
  }
}

export async function getThemeProducts(category: string, theme: string): Promise<ThemePageInfo | null> {
  try {
    const themes = await fetchThemes();
    const themeData = themes.find(t => t.slug === theme);
    
    if (!themeData) return null;

    const result = await apiFetchProducts(1, undefined, themeData.id, undefined, undefined);
    
    return {
      title: themeData.name.toUpperCase(),
      description: `Tortas temáticas de ${themeData.name.toLowerCase()}`,
      products: result.products || [],
      totalResults: result.pagination?.total || 0,
      currentResults: result.products?.length || 0
    };
  } catch (error) {
    console.error('Error fetching theme products:', error);
    return null;
  }
}

export function getAllCategories(): string[] {
  return Object.keys(categoryData);
}

export async function getCategoryThemes(category: string): Promise<ThemeInfo[]> {
  try {
    const themes = await fetchThemes();
    return themes.map(theme => ({
      id: theme.id.toString(),
      title: theme.name.toUpperCase(),
      description: `Tortas temáticas de ${theme.name.toLowerCase()}`,
      products: [],
      totalResults: 0,
      currentResults: 0,
      slug: theme.slug
    }));
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  try {
    const categoryKeys = Object.keys(categoryData);
    const categories: CategoryInfo[] = [];
    
    for (const key of categoryKeys) {
      const categoryInfo = await getCategoryWithProducts(key);
      if (categoryInfo) {
        categories.push(categoryInfo);
      }
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Object.keys(categoryData).map(key => ({
      ...categoryData[key],
      products: [],
      totalResults: 0,
      currentResults: 0
    }));
  }
} 