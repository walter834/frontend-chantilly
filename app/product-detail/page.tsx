'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductDetail from '../../components/features/ProductDetail';

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  
  // Extraer los datos de los query parameters
  const id = searchParams.get('id') || '';
  const name = searchParams.get('name') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const originalPrice = searchParams.get('originalPrice') 
    ? parseFloat(searchParams.get('originalPrice')!) 
    : undefined;
  const image = searchParams.get('image') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail
        id={id}
        name={name}
        price={price}
        originalPrice={originalPrice}
        image={image}
      />
    </div>
  );
}
