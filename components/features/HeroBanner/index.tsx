'use client';
import React from 'react';
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
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="rounded-md"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-auto object-cover" 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 