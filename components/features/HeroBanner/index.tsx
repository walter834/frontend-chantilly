'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useBreakpointer from '@/hooks/useBreakpointer';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroBannerProps {
  slides: BannerSlide[];
  className?: string;
  mobileSlides?: BannerSlide[];
}

export default function HeroBanner({ slides, className = '', mobileSlides }: HeroBannerProps) {
  const width = useBreakpointer();
  const isSmall = width > 0 && width <= 1024;

  return (
    <div className={`w-full ${className}`}>
      {isSmall ? (
        // Mobile/Tablet Swiper
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full custom-pagination-swiper "
        >
          {(mobileSlides ?? slides).map((slide) => (
            <SwiperSlide key={`${slide.id}-m`}>
              <div className="relative w-full h-[30vh] xs:h-[35vh] sm:h-[40vh] overflow-hidden bg-white">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  priority={slide.id === '1'}
                  quality={100}
                  className="w-full h-full object-contain"
                  style={{ objectPosition: 'center' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Desktop/Laptop Swiper
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full custom-pagination-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-[clamp(320px,90vh,100vh)] max-h-[100vh] overflow-hidden">
                <Image 
                  src={slide.image} 
                  alt={slide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 100vw"
                  priority={slide.id === '1'}
                  quality={100}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}