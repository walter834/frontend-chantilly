import api, { API_ROUTES } from './api';
import { ApiTheme, TransformedTheme, transformTheme } from '@/types/api';

export async function fetchThemes(): Promise<TransformedTheme[]> {
  try {
    const { data: apiThemes } = await api.get<ApiTheme[]>(API_ROUTES.THEMES);
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

export async function getThemeBySlug(slug: string): Promise<TransformedTheme | null> {
  try {
    const themes = await fetchThemes();
    return themes.find(theme => theme.slug === slug) || null;
  } catch (error) {
    console.error('Error getting theme by slug:', error);
    return null;
  }
}
