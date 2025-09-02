'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '../../../components/features/ProductDetail';
import { getProductById, getProductBySlug } from '../../../service/productService';
import { TransformedProduct } from '../../../types/api';
import Spinner from '@/components/ui/spinner';

export default function DetallePage() {
  const params = useParams();
  const [product, setProduct] = useState<TransformedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const rawParam = params.id as string;
        let candidate = rawParam;
        try {
          const url = new URL(rawParam);
          const parts = url.pathname.split('/').filter(Boolean);
          candidate = parts[parts.length - 1] || rawParam;
        } catch {}

        const isNumeric = /^\d+$/.test(candidate);
        const productData = isNumeric
          ? await getProductById(Number(candidate))
          : await getProductBySlug(candidate);
        if (!productData) {
          throw new Error('Producto no encontrado');
        }        
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
              <div className="text-center">
                <Spinner size="lg" className="mb-4" />
            </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Producto no encontrado'}
          </h1>
          <button 
            onClick={() => window.history.back()}
            className="bg-[#c41c1a] text-white px-6 py-2 rounded-md hover:bg-[#a01818] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail
        id={product.id.toString()}
        name={product.name}
        description={product.description}
        price={product.price}
        originalPrice={product.originalPrice}
        theme={product.theme_id}
        image={product.images.map((img: any) => img)}
        productType={product.product_type_id}
        product_link={product.product_link}
      />
    </div>
  );
}
