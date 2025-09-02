'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useBreakpointer from '@/hooks/useBreakpointer';
import { ApiBanner } from '@/types/api';

export default function HeroBanner({ slides, className = '', mobileSlides }: { slides: ApiBanner[]; className?: string; mobileSlides?: ApiBanner[] }) {
  const width = useBreakpointer();
  const isSmall = width > 0 && width <= 1024;

  return (
    <div className={`${className}`}>
      {isSmall ? (
        // Mobile/Tablet Swiper
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="custom-pagination-swiper border-b-[10px] border-yellow-500"
        >
          {slides
            .filter(slide => slide.status === true)
            .map((slide) => (
              <SwiperSlide key={`${slide.id}-m`}>
                <img
                  src={slide.image_url}
                  alt={slide.title}
                />
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
          className="custom-pagination-swiper border-b-[10px] border-yellow-500"
        >
          {slides
            .filter(slide => slide.status === true)
            .map((slide) => (
              <SwiperSlide key={slide.id}>
                <img
                  src={slide.image_url}
                  alt={slide.title}
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      )}
    </div>
  );
}