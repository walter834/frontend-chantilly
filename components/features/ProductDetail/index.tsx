'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const ProductDetail = ({ id, name, price, originalPrice, image }: ProductDetailProps) => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Botón de regreso */}
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center text-[#c41c1a] hover:text-[#a01818] transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image 
              src={image} 
              alt={name} 
              width={600} 
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#c41c1a]">
                S/ {price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-3xl font-bold text-[#c41c1a]">
                  S/ {originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-[#c41c1a] text-white py-3 px-6 rounded-md hover:bg-[#a01818] transition-colors font-medium">
              Agregar al carrito
            </button>
            <button className="w-full border border-[#c41c1a] text-[#c41c1a] py-3 px-6 rounded-md hover:bg-[#c41c1a] hover:text-white transition-colors font-medium">
              Comprar ahora
            </button>
          </div>
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Información del producto</h3>
            <div className="space-y-2 text-sm text-gray-600">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
