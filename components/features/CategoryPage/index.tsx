'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '../ProductGrid';
import Paginations from '@/components/Paginations';
import { TransformedProduct } from '@/types/api';

interface CategoryPageProps {
  title: string;
  description: string;
  products: TransformedProduct[];
  totalResults?: number;
  currentResults?: number;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  currentPage?: number;
  searchTerm?: string;
}

export default function CategoryPage({
  title,
  description,
  products,
  totalResults = 0,
  currentResults = 0,
  onAddToCart,
  onToggleFavorite,
  pagination,
  currentPage = 1,
  searchTerm = ''
}: CategoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black">{title}</h2>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>
      
      <div className="flex md:justify-between justify-center mx-4 mt-4">
        <p className="md:flex hidden text-muted-foreground">
          Mostrando {currentResults} de {totalResults} resultados
        </p>

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
      
      <div className="mt-6">
        <ProductGrid
          products={products}
        />
      </div>
    </div>
  );
} 