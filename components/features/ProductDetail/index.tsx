'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { capitalizeFirstLetter } from '@/lib/utils';
import { fetchAccessories, fetchProducts, getCakeFlavors, getProductVariantById } from '@/service/productService';
import { TransformedProduct, TransformedProductVariant, TransformedCakeFlavor, TransformedProductAccessory } from '@/types/api';
import FormCart from '@/components/formCart';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  theme?: string | null;
  image: string; 
  productType: string;
  description: string;
}

const ProductDetail = ({ id, name, price, originalPrice, theme, image, productType, description}: ProductDetailProps) => {
console.log('Product detail:', id, name, price, originalPrice, theme, image, productType);
  const [cakeFlavors, setCakeFlavors] = useState<TransformedCakeFlavor[]>([]);
  const [selectedCake, setSelectedCake] = useState(''); 
  const [accessories, setAccessories] = useState<TransformedProductAccessory[]>([]);  const [bocaditos, setBocaditos] = useState<TransformedProduct[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [loadingBocaditos, setLoadingBocaditos] = useState(true);
  const [productVariant, setProductVariant] = useState<TransformedProductVariant | null>(null);
  const [imageProduct, setImageProduct] = useState<string>('');
  
  // Cart item shape stored in localStorage
  interface LocalCartItem {
    productId: string;
    product: { id: string | number; name: string; description: string; price: number; image: string; type: string };
    quantity: number;
    price: number | string;
  }

  const handleAddToCart = (product: TransformedProduct | TransformedProductAccessory, isAccessory = false) => {
    const currentCart = JSON.parse(localStorage.getItem('chantilly-cart') || '{"items":[],"total":0,"itemCount":0}');
    const productType = isAccessory ? 'accessory' : 'bocadito';
    const productIdentifier = `${productType}-${product.id}`;
    
    const existingItemIndex = currentCart.items.findIndex((item: LocalCartItem) => 
      item.productId === productIdentifier
    );

    let updatedItems;
    
    if (existingItemIndex !== -1) {
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        price: parseFloat(String(updatedItems[existingItemIndex].price)) + (isAccessory ? parseFloat((product as TransformedProductAccessory).max_price) : (product as TransformedProduct).price)
      };
    } else {
      const unitPrice = isAccessory ? parseFloat((product as TransformedProductAccessory).max_price) : (product as TransformedProduct).price;
      const nameText = isAccessory ? (product as TransformedProductAccessory).short_description : (product as TransformedProduct).name;
      const newItem = {
        id: `${productIdentifier}-${Date.now()}`,
        productId: productIdentifier,
        product: {
          id: product.id,
          name: nameText,
          description: `${isAccessory ? 'Accesorio' : 'Bocadito'}: ${nameText}`,
          price: unitPrice,
          image: product.image,
          type: productType
        },
        quantity: 1,
        price: unitPrice
      };
      updatedItems = [...currentCart.items, newItem];
    }
    
    const total = updatedItems.reduce((sum: number, item: LocalCartItem) => sum + (Number(item.price) * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const updatedCart = {
      items: updatedItems,
      total,
      itemCount
    };

    localStorage.setItem('chantilly-cart', JSON.stringify(updatedCart));
/*     window.dispatchEvent(new Event('storage'));
 */    window.dispatchEvent(new Event('chantilly-cart-updated'));
    alert(existingItemIndex !== -1 ? '¡Cantidad actualizada en el carrito!' : '¡Producto agregado al carrito!');

  };

  const handlePortionChange = async (portion: string) => {
    if (!portion) {
      // reset image when no portion
      setImageProduct(image);
      setProductVariant(null);
      return;
    }
    try {
      const variant = await getProductVariantById(id, portion);
      if (variant) {
        setProductVariant(variant);
        setImageProduct(variant.image);
      }
    } catch (error) {
      console.error('Error fetching product variant:', error);
      setImageProduct(image);
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const accessoriesResponse = await fetchAccessories();
        console.log('accessoriesResponse',accessoriesResponse);
        setAccessories(accessoriesResponse);
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
        setSelectedCake(cakeFlavorResponse[0].name.toString());
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
                   - S/ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-black mb-4 text-[15px]">
              {capitalizeFirstLetter(description)}<br />
              <span className="text-[#c41c1a]"></span> Tiempo elaboración: - horas
            </p>
          </div>
          <FormCart 
            productId={id}
            name={name}
            initialPrice={price}
            productVariant={productVariant}
            cakeName={selectedCake}
            cakeFlavors={cakeFlavors}
            onPortionChange={handlePortionChange}
            theme={theme}
            imageProduct={imageProduct}
            initialImage={image}
            productType={productType}
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
                            alt={accessory.short_description}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-[#c41c1a] font-bold text-center">
                        {accessory.short_description}
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="font-bold text-[14px]">
                          S/ {parseInt(accessory.max_price).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => handleAddToCart(accessory, true)}
                          className="bg-[#c41c1a] text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-[#a01818] transition-colors"
                        >
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
              <div key={bocadito.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#c41c1a]">
                    S/ {bocadito.price.toFixed(2)}
                  </span>
                  {bocadito.originalPrice && (
                    <span className="text-sm font-bold text-[#c41c1a]">
                      S/ {bocadito.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(bocadito, false);
                  }}
                  className="w-full bg-[#c41c1a] text-white text-sm px-2 py-1 rounded cursor-pointer hover:bg-[#a01818] transition-colors"
                >
                  Agregar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
