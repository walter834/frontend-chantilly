'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
}

export default function HeroBanner({ slides, className = '' }: HeroBannerProps) {
  return (
    <div className={`w-full ${className}`}>
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
            <div className="relative w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[800px]">
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                sizes="(max-width: 380px) 100vw,
                       (max-width: 640px) 100vw,
                       (max-width: 768px) 100vw,
                       (max-width: 1024px) 100vw,
                       100vw"
                priority={slide.id === '1'}
                quality={100}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center',
                  objectFit: 'cover',
                  maxWidth: '100%'
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 