'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/features/ProductGrid';
import Paginations from '@/components/Paginations';
import { TransformedProduct } from '@/types/api';
import { fetchProducts } from '@/service/productService';
import Spinner from '@/components/ui/spinner';

export default function ThematicCakes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  
  const currentPage = parseInt(searchParams.get('tematicas_page') || '1', 10);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Assuming category ID for 'tortas-tematicas' is '2'. Adjust as needed.
        const result = await fetchProducts(
          currentPage,
          undefined,
          '2', // Category ID for Tortas Temáticas
          undefined,
          '',
          1 // Featured products (as number)
        );

        setProducts(result.products);
        setPagination({
          currentPage: result.pagination.currentPage,
          perPage: result.pagination.perPage,
          total: result.pagination.total,
          lastPage: result.pagination.lastPage,
          hasNextPage: result.pagination.hasNextPage,
          hasPrevPage: result.pagination.hasPrevPage
        });
      } catch (error) {
        console.error('Error loading thematic cakes:', error);
        setProducts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('tematicas_page', page.toString());
    router.push(`?${params.toString()}`);
  };

  if (loading && products.length === 0) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center py-12">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500">Cargando tortas temáticas...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't render anything if no products
  }

  return (
    <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black">Tortas Temáticas</h2>
        <p className="text-gray-500 mt-2">
          Descubre nuestras deliciosas tortas temáticas para tus celebraciones especiales.
        </p>
      </div>
      
      {pagination && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Mostrando {products.length} de {pagination.total} resultados
          </p>
          <Paginations 
            currentPage={pagination.currentPage}
            totalPages={pagination.lastPage}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            pageParam="tematicas_page"
          />
        </div>
      )}
      
      <div className="mt-6">
        <ProductGrid
          products={products}
          onAddToCart={(id) => console.log('Add to cart:', id)}
          onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
        />
      </div>
    </div>
  );
}
