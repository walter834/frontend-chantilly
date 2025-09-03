'use client';
import React, { useEffect, useState } from 'react';
import CategoryPage from '@/components/features/CategoryPage';
import { getThemeProducts } from '@/lib/categories';
import { getProductsByTheme } from '@/service/productService';
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
  
  const [themeInfo, setThemeInfo] = useState<{ title: string; description: string } | null>(null);
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
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const currentPage = parseInt(page) || 1;
        const searchTerm = search || '';
        const result = await getProductsByTheme(theme, currentPage, searchTerm);
        if (!cancelled) {
          setProducts(result.products);
          setPagination(result.pagination);
          setThemeInfo({
            title: theme.toUpperCase(),
            description: `Tortas temáticas de ${theme.toLowerCase()}`
          });
        }
      } catch (error) {
        if (!cancelled) {
          setProducts([]);
          setPagination({
            currentPage: 1,
            perPage: 8,
            total: 0,
            lastPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [theme, page, search]);

  if (!themeInfo) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Temática no encontrada</h2>
          <p className="text-gray-500 mt-2">
            La temática &quot;{theme}&quot; en la categoría &quot;{category}&quot; no existe.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Temáticas disponibles para tortas-tematicas: infantiles, mujer, hombre, bautizo, profesiones, enamorados, babyshower
          </p>
        </div>
      </div>
    );
  }

  if (loading || !themeInfo) {
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
      title={themeInfo?.title || 'Cargando...'}
      description={themeInfo?.description || 'Cargando descripción...'}
      products={products}
      totalResults={pagination.total}
      currentResults={products.length}
      pagination={pagination}
      currentPage={parseInt(page) || 1}
      searchTerm={search}
    />
  );
} 