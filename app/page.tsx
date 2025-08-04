'use client';
import React from 'react';
import HeroBanner from '@/components/features/HeroBanner';
import ProductCard from '@/components/features/ProductCard';
import { BannerSlide, Product } from '@/types';

// Datos de ejemplo para el banner
const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    image: '/imgs/banners/banner2.jpg',
    title: 'Bienvenidos a Chantilly',
    subtitle: 'Descubre nuestros productos artesanales con la más alta calidad',
    ctaText: 'Ver Productos',
    ctaLink: '/productos',
    active: true,
  },
  {
    id: '2',
    image: '/imgs/banners/banner2.jpg',
    title: 'Torta Selva Negra',
    subtitle: 'El sabor auténtico que buscas',
    ctaText: 'Comprar Ahora',
    ctaLink: '/productos/torta-selva-negra',
    active: true,
  },
  {
    id: '3',
    image: '/imgs/banners/banner2.jpg',
    title: 'Descuento 20%',
    subtitle: 'En toda nuestra línea de productos',
    ctaText: 'Aprovechar Oferta',
    ctaLink: '/ofertas',
    active: true,
  },
];

const recommendedProducts: Product[] = [
  {
    id: '1',
    name: 'CHEESCAKE DE MARACUYA',
    description: 'Cheesecake de maracuya',
    price: 50.00,
    image: '/imgs/banners/banner2.jpg',
    category: 'Postres',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'BRAZO GITANO',
    description: 'Brazo gitano',
    price: 40.00,
    image: '/imgs/banners/banner2.jpg',
    category: 'Postres',
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'TORTA AMOR MEME - BUTTER CREAM',
    description: 'Torta amor meme - butter cream',
    price: 90.00,
    originalPrice: 140.00,
    image: '/imgs/banners/banner2.jpg',
    category: 'Tortas',
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'TORTA PARA HOMBRE CON DEGRADADO – BUTTER CREAM',
    description: 'Torta para hombre con degradado - butter cream',
    price: 90.00,
    originalPrice: 150.00,
    image: '/imgs/banners/banner2.jpg',
    category: 'Tortas',
    stock: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroBanner slides={bannerSlides} />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Productos destacados</h2>
          <p className="text-gray-500 mt-2">Los mejores postres en la Casa del Chantilly, calidad y amor.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              onAddToCart={(productId) => {
                console.log('Agregar al carrito:', productId);
              }}
              onToggleFavorite={(productId) => {
                console.log('Toggle favorito:', productId);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
