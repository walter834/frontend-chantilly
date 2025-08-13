'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { capitalizeFirstLetter } from '@/lib/utils';
import { fetchProducts, getCakeFlavors, getProductVariantById } from '@/service/productService';
import { TransformedProduct, TransformedProductVariant, TransformedCakeFlavor } from '@/types/api';
import FormCart from '@/components/formCart';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  theme?: string | null;
  image: string; 
 
}

const ProductDetail = ({ id, name, price, originalPrice, theme, image}: ProductDetailProps) => {
console.log('Product detail:', id, name, price, originalPrice, theme, image);
  const [cakeFlavors, setCakeFlavors] = useState<TransformedCakeFlavor[]>([]);
  const [selectedCake, setSelectedCake] = useState(''); 
  const [accessories, setAccessories] = useState<TransformedProduct[]>([]);
  const [bocaditos, setBocaditos] = useState<TransformedProduct[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [loadingBocaditos, setLoadingBocaditos] = useState(true);
  const [productVariant, setProductVariant] = useState<TransformedProductVariant | null>(null);
  const [priceProduct, setPriceProduct] = useState<string>('0.00');
  const [imageProduct, setImageProduct] = useState<string>('');

  const handlePortionChange = async (portion: string) => {
    if (!portion) {
      setPriceProduct('0.00');
      setImageProduct(image);
      setProductVariant(null);
      return;
    }
    try {
      const variant = await getProductVariantById(id, portion);
      if (variant) {
        setProductVariant(variant);
        setPriceProduct(variant.price);
        setImageProduct(variant.image);
      }
    } catch (error) {
      console.error('Error fetching product variant:', error);
      setPriceProduct(price.toFixed(2));
      setImageProduct(image);
    }
  };

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
    const fetchCakeFlavors = async () => {
      try {
        const cakeFlavorResponse = await getCakeFlavors();
        setCakeFlavors(cakeFlavorResponse);
      } catch (error) {
        console.error('Error fetching cake flavors:', error);
      }
    };
    
    fetchCakeFlavors();
  }, []);

  useEffect(() => {
    const fetchProductVariant = async () => {
      try {
        const variantResponse = await getProductVariantById(id, '');
        setProductVariant(variantResponse);
      } catch (error) {
        console.error('Error fetching product variant:', error);
      }
    };
    
    fetchProductVariant();
  }, [id]);

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
              <div className="ml-2">
                <h1 className="text-[20px] font-bold text-[#c41c1a] uppercase mb-2">
                  {capitalizeFirstLetter(name)}
                </h1>
              </div>
              <div className="flex items-center gap-2 mb-4">
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
          <FormCart 
            productId={id}
            initialPrice={price}
            productVariant={productVariant}
            cakeFlavors={cakeFlavors}
            onPortionChange={handlePortionChange}
            theme={theme}
            imageProduct={imageProduct}
          />
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
      <div className="mt-12 border-t-2 border-[#c41c1a]">
        <h2 className="text-4xl font-bold text-center text-black mb-8 pt-3">
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
