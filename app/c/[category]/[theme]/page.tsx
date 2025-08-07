'use client';
import React, { useEffect, useState } from 'react';
import CategoryPage from '@/components/features/CategoryPage';
import { getThemeProducts } from '@/lib/categories';
import { getProductsByTheme } from '@/lib/api-services';
import { TransformedProduct } from '@/types/api';
import Spinner from '@/components/ui/spinner';

interface ThemePageProps {
  params: Promise<{
    category: string;
    theme: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default function ThemePage({ params, searchParams }: ThemePageProps) {
  const { category, theme } = React.use(params);
  const { page = '1', search = '' } = React.use(searchParams);
  const themeInfo = getThemeProducts(category, theme);
  
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 8,
    total: 0,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const currentPage = parseInt(page) || 1;
        const searchTerm = search || '';
        
        // Usar la versión simple que funcionaba antes
        const result = await getProductsByTheme(theme, currentPage, searchTerm);
        
        setProducts(result.products);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setPagination({
          currentPage: 1,
          perPage: 8,
          total: 0,
          lastPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [theme, page, search]);

  if (!themeInfo) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Temática no encontrada</h2>
          <p className="text-gray-500 mt-2">
            La temática "{theme}" en la categoría "{category}" no existe.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Temáticas disponibles para tortas-tematicas: infantiles, mujer, hombre, bautizo, profesiones, enamorados, babyshower
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <CategoryPage
      title={themeInfo.title}
      description={themeInfo.description}
      products={products}
      totalResults={pagination.total}
      currentResults={products.length}
      onAddToCart={(productId: string) => {
        console.log('Agregar al carrito:', productId);
      }}
      onToggleFavorite={(productId: string) => {
        console.log('Toggle favorito:', productId);
      }}
      pagination={pagination}
      currentPage={parseInt(page) || 1}
      searchTerm={search}
    />
  );
} 