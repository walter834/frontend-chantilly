'use client';
import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isFavorite?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 0,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite
}: ProductCardProps) {
  return (
    <div className="text-center group">
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-[#c41c1a] text-lg">{name}</h3>
        
        <p className="text-gray-600 text-sm">{name}</p>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-bold text-gray-900">S/ {price.toFixed(2)}</span>
          <span className="text-lg font-bold text-gray-900"> - S/ {originalPrice?.toFixed(2)}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(id)}
          className="mt-4 bg-[#c41c1a] text-white py-2 px-6 rounded-md hover:bg-[#a01818] transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <span>Ver opciones</span>
        </button>
      </div>
    </div>
  );
} 