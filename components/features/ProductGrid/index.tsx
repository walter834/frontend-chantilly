'use client';
import React from 'react';
import ProductCard from '../ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isFavorite?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  loading?: boolean;
}

export default function ProductGrid({ 
  products, 
  onAddToCart, 
  onToggleFavorite, 
  loading = false 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          No se encontraron productos
        </div>
        <p className="text-gray-400">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
} 