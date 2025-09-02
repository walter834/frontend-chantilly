'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchThemes } from '@/service/themeService';
import { TransformedTheme } from '@/types/api';

export default function Header() {
  const pathname = usePathname();
  const [themes, setThemes] = useState<TransformedTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themesData = await fetchThemes();
        setThemes(themesData);
      } catch (error) {
        console.error('Error loading themes:', error);
        // Fallback a datos estáticos
        setThemes([
          { id: 1, name: 'INFANTILES', slug: 'infantiles', icon: '/imgs/icons/iconos-05.png', link: '/c/tortas-tematicas/infantiles' },
          { id: 2, name: 'MUJER', slug: 'mujer', icon: '/imgs/icons/iconos-03.png', link: '/c/tortas-tematicas/mujer' },
          { id: 3, name: 'HOMBRE', slug: 'hombre', icon: '/imgs/icons/iconos-04.png', link: '/c/tortas-tematicas/hombre' },
          { id: 4, name: 'BAUTIZO', slug: 'bautizo', icon: '/imgs/icons/iconos-07.png', link: '/c/tortas-tematicas/bautizo' },
          { id: 5, name: 'PROFESIONES', slug: 'profesiones', icon: '/imgs/icons/iconos-06.png', link: '/c/tortas-tematicas/profesiones' },
          { id: 6, name: 'ENAMORADOS', slug: 'enamorados', icon: '/imgs/icons/iconos-13.png', link: '/c/tortas-tematicas/enamorados' },
          { id: 7, name: 'BABYSHOWER', slug: 'babyshower', icon: '/imgs/icons/iconos-10.png', link: '/c/tortas-tematicas/babyshower' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, []);

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="overflow-x-auto flex justify-start gap-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-b border-gray-200 bg-white shadow-lg">
          <div className="animate-pulse">
            <div className="h-[45px] w-[45px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="overflow-x-auto flex justify-start gap-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-b border-gray-200 bg-white shadow-lg">
        {themes.map((theme) => {
          const isActive = pathname === theme.link || pathname.startsWith(theme.link);
          return (
            <Link
              key={theme.id}
              href={theme.link}
              className="group flex flex-col items-center min-w-fit cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center px-2 py-1 gap-3">
                <Image
                  src={theme.icon}
                  alt={`Icono de ${theme.name}`}
                  width={45}
                  height={45}
                  className={`w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] transition duration-120 ${
                    isActive 
                      ? '[filter:sepia(77%)_brightness(42%)_hue-rotate(314deg)_saturate(1000%)_contrast(104%)]' 
                      : 'group-hover:[filter:sepia(77%)_brightness(42%)_hue-rotate(314deg)_saturate(1000%)_contrast(104%)]'
                  }`}
                />
                <span className={`text-[12px] sm:text-sm font-bold font-poppins transition whitespace-nowrap ${
                  isActive 
                    ? 'text-[#c41c1a]' 
                    : 'text-[#828282] group-hover:text-[#c41c1a]'
                }`}>
                  {theme.name}
                </span>
              </div>
              <div className={`h-[3px] w-full transition-all duration-300 origin-center ${
                isActive 
                  ? 'scale-x-100 bg-[#c41c1a]' 
                  : 'scale-x-0 group-hover:scale-x-100 bg-[#c41c1a]'
              }`}></div>
            </Link>
          );
        })}
      </div>
    </header>
  );
} 