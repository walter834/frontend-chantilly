'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/features/HeroBanner';
import ProductGrid from '@/components/features/ProductGrid';
import Paginations from '@/components/Paginations';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchTerm = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(searchTerm);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchProducts(
          currentPage,
          undefined,
          undefined,
          undefined,
          searchTerm,
          '1'
        );
        setProducts(result.products);
        setPagination({
          currentPage: result.pagination.currentPage,
          perPage: result.pagination.perPage,
          total: result.pagination.total,
          lastPage: result.pagination.lastPage,
          hasNextPage: result.pagination.hasNextPage,
          hasPrevPage: result.pagination.hasPrevPage
        });
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  const handleAddToCart = (productId: string) => {
    console.log('Agregar al carrito:', productId);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favorito:', productId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <HeroBanner slides={bannerSlides} />
      
      <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Productos Destacados'}
          </h2>
          <p className="text-gray-500 mt-2">
            {searchTerm 
              ? 'Encuentra los productos que estás buscando'
              : 'Las mejores tortas en la Casa del Chantilly, calidad y amor.'
            }
          </p>
        </div>
        
        <div className="flex md:justify-between justify-center mx-4 mt-4">
          {pagination && (
            <p className="md:flex hidden text-muted-foreground">
              Mostrando {products.length} de {pagination.total} resultados
            </p>
          )}

          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center border border-gray-300 rounded-lg px-2.5 py-1.5 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full border-0 outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
        
        {pagination && (
          <Paginations 
            currentPage={pagination.currentPage}
            totalPages={pagination.lastPage}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        ) : (
          <div className="mt-6">
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
}
