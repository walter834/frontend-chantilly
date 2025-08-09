import React, { Suspense } from 'react';
import HeroBanner from '@/components/features/HeroBanner';
import HomePageContent from '@/components/features/HomePageContent';
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
  return (
    <div className="min-h-screen">
      <HeroBanner slides={bannerSlides} />
      
      <Suspense fallback={
        <div className="w-[95%] mx-auto px-2 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="text-center py-12">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        </div>
      }>
        <HomePageContent />
      </Suspense>
    </div>
  );
}
