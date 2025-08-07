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
            <Image 
              src={slide.image} 
              alt={slide.title} 
              width={1200}
              height={600}
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover" 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 