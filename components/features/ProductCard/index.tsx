'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  product_link: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  product_link
}: ProductCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    console.log(product_link);
    // Navegación segura: solo pasamos el ID
    router.push(product_link);
  };
  return (
    <div className="text-center group">
      <div className="relative mb-4 overflow-hidden rounded-lg cursor-pointer">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          onClick={handleViewDetails}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-[#c41c1a] text-lg">{name}</h3>
        
        <p className="text-black font-normal text-sm">{description}</p>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-bold text-gray-900">S/ {price.toFixed(2)}</span>
          <span className="text-lg font-bold text-gray-900"> - S/ {originalPrice?.toFixed(2)}</span>
        </div>
        <button
          onClick={handleViewDetails}
          className="mt-4 bg-[#c41c1a] text-white py-2 px-6 rounded-md hover:bg-[#a01818] transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer"
        >
          <span>Ver opciones</span>
        </button>
      </div>
    </div>
  );
} 