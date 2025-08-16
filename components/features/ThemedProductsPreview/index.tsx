'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/features/ProductGrid';
import Spinner from '@/components/ui/spinner';
import { TransformedProduct } from '@/types/api';
import { getProductsByCategory } from '@/service/productService';

export default function ThemedProductsPreview() {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        // category slug 'tortas-tematicas' => id 2
        const result = await getProductsByCategory('tortas-tematicas', 1);
        if (!cancelled) setProducts(result.products);
      } catch (e) {
        if (!cancelled) setProducts([]);
        console.error('Error loading themed products preview', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black">Tortas Temáticas</h2>
        <p className="text-gray-500 mt-2">Los mejores postres en la Casa del Chantilly, calidad y amor.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : (
        <div className="mt-6">
          <ProductGrid products={products.slice(0, 4)} />
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/c/tortas-tematicas"
          className="inline-block bg-[#c41c1a] hover:bg-[#a91917] text-white font-medium py-3 px-6 rounded-md"
        >
          Ver todas las tortas temáticas
        </Link>
      </div>
    </section>
  );
}
