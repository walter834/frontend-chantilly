'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { capitalizeFirstLetter } from '@/lib/utils';
import { fetchAccessories, fetchProducts, getCakeFlavors, getProductVariantById } from '@/service/productService';
import { TransformedProduct, TransformedProductVariant, TransformedCakeFlavor, TransformedProductAccessory } from '@/types/api';
import FormCart from '@/components/formCart';
import { useRouter } from 'next/navigation';
import { portionsOptions } from './data';
import { FaClock } from "react-icons/fa6";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  theme?: string | null;
  image: any[];
  productType: string;
  description: string;
  product_link: string;
}

interface AccessoryItemProps {
  accessory: any;
  onAddToCart: (product: any, isAccessory?: boolean) => void;
}

const AccessoryItem = ({ accessory, onAddToCart }: AccessoryItemProps) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const imageUrls = accessory.images?.map((image: any) => image.url) || [];

  return (
    <div className="flex flex-col items-center p-2">
      <div className="w-full">
        <div
          className="bg-gray-200 rounded mb-1 overflow-hidden relative"
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
          style={{ aspectRatio: '1/1' }}
        >
          {imageUrls.map((url: string, imgIndex: number) => (
            <Image
              key={imgIndex}
              src={url}
              alt={accessory.short_description}
              width={128}
              height={128}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              style={{
                aspectRatio: '1/1',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1)'
              }}
              priority={imgIndex === 0}
              loading={imgIndex === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <p className="text-sm text-[#c41c1a] font-bold text-center">
          {accessory.short_description}
        </p>
        <div className="grid grid-cols-1 gap-2 items-center justify-center">
          <div className="font-bold text-[14px] text-center">
            S/ {parseInt(accessory.max_price).toFixed(2)}
          </div>
          <div className="text-center">
            <button
              onClick={() => onAddToCart(accessory, true)}
              className="bg-[#c41c1a] text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-[#a01818] transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ id, name, price, originalPrice, theme, image, productType, description, product_link }: ProductDetailProps) => {
  const router = useRouter();
  const [cakeFlavors, setCakeFlavors] = useState<TransformedCakeFlavor[]>([]);
  const [selectedCake, setSelectedCake] = useState('');
  const [accessories, setAccessories] = useState<TransformedProductAccessory[]>([]);
  const [bocaditos, setBocaditos] = useState<TransformedProduct[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(true);
  const [loadingBocaditos, setLoadingBocaditos] = useState(true);
  const [productVariant, setProductVariant] = useState<TransformedProductVariant | null>(null);
  const [imageProduct, setImageProduct] = useState<string[]>([]);
  const [hour, setHour] = useState<number>(0);
  const [diameter, setDiameter] = useState<string>('');

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
        price: (isAccessory ? parseFloat((product as TransformedProductAccessory).max_price) : (product as TransformedProduct).price)
      };
    } else {
      console.log('productSelected', product);
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
          image: product.images.find((img: any) => img.is_primary === 1)?.url || '',
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
    window.dispatchEvent(new Event('chantilly-cart-updated'));
    window.dispatchEvent(new Event('open-cart'));

  };

  const handlePortionChange = async (portion: string) => {
    if (!portion) {
      setImageProduct(image);
      setProductVariant(null);
      setDiameter('');
      return;
    }
    const d = portionsOptions.find((p: any) => p.name === portion)?.size || '';
    setDiameter(d);
    try {
      const variant = await getProductVariantById(id, portion);
      if (variant) {
        setProductVariant(variant);
        setImageProduct(variant.images.map((img: any) => img.url));
        setHour(variant.hours);
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
        console.log('accessoriesResponse', accessoriesResponse);
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
        if (productType === '2' && cakeFlavorResponse.length) {
          setSelectedCake(cakeFlavorResponse[0].id.toString());
        }

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
        console.log('variantResponse', variantResponse);
        setProductVariant(variantResponse);
      } catch (error) {
        console.error('Error fetching product variant:', error);
      }
    };

    fetchProductVariant();
  }, [id]);

  const handleViewDetails = (productId: string) => {
    router.push(`/detalle/${productId}`);
  };

  const displayImages = imageProduct.length > 0 ? imageProduct : image;
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {displayImages.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                className="custom-pagination-swiper"
              >
                {/* Ordenar imágenes con is_primary: 1 primero */}
                {[...displayImages]
                  .sort((a, b) => {
                    const aPrimary = typeof a === 'object' ? a.is_primary === 1 : false;
                    const bPrimary = typeof b === 'object' ? b.is_primary === 1 : false;
                    return bPrimary ? 1 : aPrimary ? -1 : 0;
                  })
                  .map((img, index) => {
                    const src = typeof img === 'string' ? img : img.url;
                    const isPrimary = typeof img === 'object' ? img.is_primary === 1 : index === 0;

                    return (
                      <SwiperSlide key={src}>
                        <Image
                          src={src}
                          alt={`${name} - Imagen ${index + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          priority={isPrimary}
                        />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            ) : (
              <Image
                src={displayImages[0]?.url || displayImages[0] || '/placeholder-product.jpg'}
                alt={name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={displayImages[0]?.is_primary === 1 || true}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-4 border-2 border-black rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="ml-2">
                <h1 className="text-[20px] md:text-xl lg:text-[20px] font-bold text-[#c41c1a] uppercase mb-2">
                  {capitalizeFirstLetter(name)}
                </h1>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[20px] md:text-xl lg:text-[22px] font-bold text-[#c41c1a]">
                  S/ {price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-[20px] md:text-xl lg:text-[22px] font-bold text-[#c41c1a]">
                    - S/ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-black mb-4 text-[16px]">
              {capitalizeFirstLetter(description)}<br />
              {productType === '2' && (
                <span>
                  <FaClock size={20} className="inline mr-1 text-[#c41c1a]" /> Tiempo elaboración: {hour} horas
                </span>
              )}
            </p>
            {/* Diámetro visible solo en carrito */}
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
            imageProduct={imageProduct[0]}
            initialImage={image.find((img: any) => img.is_primary === 1)?.url || image[0]?.url}
            productType={productType}
            hour={hour}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="font-bold text-center text-black mb-4">ACCESORIOS</h3>
            <div className="grid grid-cols-2 gap-2 overflow-y-scroll h-[500px]">
              {loadingAccessories ? (
                <div className="text-center text-gray-500">Cargando...</div>
              ) : (
                accessories.map((accessory, index) => (
                  <AccessoryItem
                    key={accessory.id || index}
                    accessory={accessory}
                    onAddToCart={handleAddToCart}
                  />
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
                    src={bocadito.images.find((img: any) => img.is_primary === 1)?.url || ''}
                    alt={bocadito.name}
                    width={150}
                    height={150}
                    onClick={() => handleViewDetails(bocadito.id.toString())}
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
                {/* <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(bocadito, false);
                  }}
                  className="w-full bg-[#c41c1a] text-white text-sm px-2 py-1 rounded cursor-pointer hover:bg-[#a01818] transition-colors"
                >
                  Agregar
                </button> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
