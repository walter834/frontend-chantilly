'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryPage from '@/components/features/CategoryPage';
import { getCategoryInfo } from '@/lib/categories';
import { getProductsByCategory } from '@/service/productService';
import { TransformedProduct } from '@/types/api';
import Spinner from '@/components/ui/spinner';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPageComponent({ params }: CategoryPageProps) {
  const { category } = React.use(params);
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  
  const categoryInfo = getCategoryInfo(category);
  
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
    const loadProducts = async () => {
      setLoading(true);
      try {
        const currentPage = parseInt(page) || 1;
        const searchTerm = search || '';
        const result = await getProductsByCategory(category, currentPage, searchTerm);
        if (!cancelled) {
          setProducts(result.products);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (!cancelled) {
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
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProducts();
    return () => { cancelled = true; };
  }, [category, page, search]);

  if (!categoryInfo) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Categoría no encontrada</h2>
          <p className="text-gray-500 mt-2">
            La categoría &quot;{category}&quot; no existe.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Categorías disponibles: tortas, tortas-tematicas, postres, bocaditos, promociones
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

  const handleAddToCart = (productId: string) => {
    console.log('Agregar al carrito:', productId);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favorito:', productId);
  };

  return (
    <CategoryPage
      title={categoryInfo.title}
      description={categoryInfo.description}
      products={products}
      totalResults={pagination.total}
      currentResults={products.length}
      onAddToCart={handleAddToCart}
      onToggleFavorite={handleToggleFavorite}
      pagination={pagination}
      currentPage={parseInt(page) || 1}
      searchTerm={search}
    />
  );
} 