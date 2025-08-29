'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/features/ProductGrid';
import Spinner from '@/components/ui/spinner';
import Paginations from '@/components/Paginations';
import { TransformedProduct } from '@/types/api';
import { getProductsByCategory } from '@/service/productService';

export default function ThemedProductsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('tematica_page') || '1', 10);
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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await getProductsByCategory('tortas-tematicas', currentPage);
        if (!cancelled) {
          setProducts(result.products);
          setPagination(result.pagination);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Error loading themed products', e);
          setProducts([]);
          setPagination(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('tematica_page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black">Tortas Temáticas</h2>
        <p className="text-gray-500 mt-2">Los mejores postres en la Casa del Chantilly, calidad y amor.</p>
      </div>

      {pagination && (
        <Paginations
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          onPageChange={handlePageChange}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : (
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      )}
    </section>
  );
}
