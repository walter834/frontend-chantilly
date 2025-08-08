'use client';
import React, { useEffect, useState } from 'react';
import HeroBanner from '@/components/features/HeroBanner';
import CategoryPage from '@/components/features/CategoryPage';
import { TransformedProduct } from '@/types/api';
import { fetchProducts } from '@/lib/api-services';
import Spinner from '@/components/ui/spinner';

const bannerSlides = [
  {
    id: '1',
    image: '/imgs/banners/banner2.jpg',
    title: 'Banner 1',
    subtitle: 'Descripción del banner 1',
    ctaText: 'Ver más',
    ctaLink: '/c/tortas',
    active: true,
  },
  {
    id: '2',
    image: '/imgs/banners/banner2.jpg',
    title: 'Banner 2',
    subtitle: 'Descripción del banner 2',
    ctaText: 'Ver más',
    ctaLink: '/c/postres',
    active: false,
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        // Obtener productos destacados (best_status = true)
        const result = await fetchProducts(1, undefined, undefined, undefined, undefined);
        console.log('resultado',result);
        const bestProducts = result.products.filter(product => product.isBestSeller);
        setFeaturedProducts(bestProducts.slice(0, 6)); // Mostrar máximo 6 productos
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    console.log('Agregar al carrito:', productId);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favorito:', productId);
  };

  return (
    <div className="min-h-screen">
      <HeroBanner slides={bannerSlides} />
      
      {loading ? (
        <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-500">Cargando productos destacados...</p>
          </div>
        </div>
      ) : (
        <CategoryPage
          title="Productos Destacados"
          description="Los mejores productos seleccionados especialmente para ti"
          products={featuredProducts}
          totalResults={featuredProducts.length}
          currentResults={featuredProducts.length}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
