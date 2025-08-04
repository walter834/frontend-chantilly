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
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite?.(id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        {/* Discount Badge */}
        {originalPrice && originalPrice > price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm">{name}</p>

        {/* Price */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-bold text-gray-900">S/ {price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">S/ {originalPrice.toFixed(2)}</span>
          )}
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