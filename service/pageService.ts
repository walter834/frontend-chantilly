import api, { API_ROUTES } from './api';
import { ApiPage, TransformedPage, transformPage } from '@/types/api';

export async function fetchPages(): Promise<TransformedPage[]> {
  try {
    const { data: apiPages } = await api.get<ApiPage[]>(API_ROUTES.PAGES);
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

export async function getPageBySlug(slug: string): Promise<TransformedPage | null> {
  try {
    const pages = await fetchPages();
    return pages.find(page => page.slug === slug) || null;
  } catch (error) {
    console.error('Error getting page by slug:', error);
    return null;
  }
}
