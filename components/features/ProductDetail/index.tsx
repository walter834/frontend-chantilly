'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '@/lib/utils';
import { fetchProducts, getProductVariantById } from '@/service/productService';
import { TransformedProduct, TransformedProductVariant } from '@/types/api';
import { portionsOptions } from './data';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const ProductDetail = ({ id, name, price, originalPrice, image }: ProductDetailProps) => {
  const router = useRouter();
  const [selectedPortion, setSelectedPortion] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dedication, setDedication] = useState('');
  const [accessories, setAccessories] = useState<TransformedProduct[]>([]);
  const [bocaditos, setBocaditos] = useState<TransformedProduct[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [loadingBocaditos, setLoadingBocaditos] = useState(true);
  const [productVariant, setProductVariant] = useState<TransformedProductVariant | null>(null);
  const [priceProduct, setPriceProduct] = useState<string>('0.00');
  const [imageProduct, setImageProduct] = useState<string>('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const accessoriesResponse = await fetchProducts(1, 5);
        setAccessories(accessoriesResponse.products.slice(0, 8));
        setLoadingAccessories(false);

        const bocaditosResponse = await fetchProducts(1, 4);
        setBocaditos(bocaditosResponse.products.slice(0, 6));
        setLoadingBocaditos(false);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setLoadingAccessories(false);
        setLoadingBocaditos(false);
      }
    };

    fetchCategoryProducts();
  }, []);

  useEffect(() => {
    const fetchProductVariant = async () => {
      try {
        const productVariantResponse = await getProductVariantById(id, selectedPortion);
        setProductVariant(productVariantResponse);
        setPriceProduct(productVariantResponse?.price || '0.00');
        setImageProduct(productVariantResponse?.image || '');
        } catch (error) {
        console.error('Error fetching product variant:', error);
      }
    };
  
    if (selectedPortion) {
      fetchProductVariant();
    }
  }, [selectedPortion, id]);  

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={(imageProduct || image)}
              alt={name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-4 border-2 border-black rounded-lg p-6 bg-white">
            <div className="flex flex-col-2 justify-between">
              <h1 className="text-xl font-bold text-[#c41c1a] uppercase mb-2">
                {capitalizeFirstLetter(name)}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-[#c41c1a]">
                  S/ {price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-2xl font-bold text-[#c41c1a]">
                    S/ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-black mb-4">
              {capitalizeFirstLetter(name)}<br />
              <span className="text-[#c41c1a]"></span> Tiempo elaboración: - horas
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">
                Porciones
              </label>
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
              >
                {Object.entries(portionsOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">
                Opciones de cake
              </label>
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
              >
                {Object.entries(portionsOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">
                Opciones de relleno
              </label>
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
              >
                {Object.entries(portionsOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0">
                Día de recojo
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="text-sm font-medium text-black sm:w-32 sm:flex-shrink-0 sm:pt-2">
                Nombre o Dedicatoria
              </label>
              <textarea
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="Escribe tu dedicatoria"
                rows={3}
                className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c41c1a] focus:border-[#c41c1a] resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-3xl font-bold text-[#c41c1a] sm:w-32 sm:flex-shrink-0 text-center sm:text-left">
                S/ {priceProduct} {/* precio del producto */}
              </div>
              <button className="w-full sm:flex-1 bg-[#c41c1a] text-white py-3 px-6 rounded-md hover:bg-[#a01818] transition-colors font-medium cursor-pointer">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="font-bold text-center text-black mb-4">ACCESORIOS</h3>
            <div className="grid grid-cols-2 gap-2 overflow-y-scroll h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {loadingAccessories ? (
                <div className="text-center text-gray-500">Cargando...</div>
              ) : (
                accessories.map((accessory, index) => (
                  <div key={accessory.id || index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded mb-1 overflow-hidden">
                        {accessory.image && (
                          <Image
                            src={accessory.image}
                            alt={accessory.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-[#c41c1a] font-bold text-center">
                        {accessory.name}
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="font-bold text-[14px]">
                          S/ {accessory.price.toFixed(2)}
                        </div>
                        <button className="bg-[#c41c1a] text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-[#a01818] transition-colors">
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center text-black mb-8">
          Bocaditos para acompañar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loadingBocaditos ? (
            <div className="col-span-full text-center text-gray-500">Cargando bocaditos...</div>
          ) : (
            bocaditos.map((bocadito) => (
              <div key={bocadito.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-md mb-2">
                  <Image
                    src={bocadito.image}
                    alt={bocadito.name}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                  {bocadito.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#c41c1a]">
                    S/ {bocadito.price.toFixed(2)}
                  </span>
                  {bocadito.originalPrice && (
                    <span className="text-sm font-bold text-[#c41c1a]">
                      S/ {bocadito.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
