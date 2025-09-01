'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: any[];
  product_link: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  images,
  product_link
}: ProductCardProps) {
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageUrls = images.map((image: any) => image.url);

  const handleViewDetails = () => {
    router.push(product_link);
  };

  return (
    <div className="text-center group">
      <div 
        className="relative mb-4 overflow-hidden rounded-lg cursor-pointer"
        onMouseEnter={() => {
          setIsHovered(true);
          if (imageUrls.length > 1) {
            setCurrentImageIndex(1);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        onClick={handleViewDetails}
      >
        <div className="relative w-full h-full" style={{ aspectRatio: '1/1' }}>
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={name}
              width={300}
              height={300}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1)'
              }}
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-[#c41c1a] text-lg">{name}</h3>
        
        <p className="text-black font-normal text-sm">{description}</p>

        <div className="flex items-center justify-center space-x-2">
          <span className="sm:text-lg text-sm font-bold text-gray-900">S/ {price.toFixed(2)}</span>
          <span className="sm:text-lg text-sm font-bold text-gray-900"> - S/ {originalPrice?.toFixed(2)}</span>
        </div>
        <button
          onClick={handleViewDetails}
          className="mt-4 bg-[#c41c1a] text-white py-2 px-6 rounded-md hover:bg-[#a01818] transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer"
        >
          <span className="sm:text-[16px] text-sm">Ver opciones</span>
        </button>
      </div>
    </div>
  );
} 