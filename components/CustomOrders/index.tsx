"use client";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { getBannerSecondary } from "@/service/bannerFooter/bannerFooterService";

export default function CustomOrders() {
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerImageMobile, setBannerImageMobile] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      const getBannerSlides = await getBannerSecondary();
      console.log('bannerCustom', getBannerSlides[0]);
      setBannerTitle(getBannerSlides[0].title || '');
      setBannerDescription(getBannerSlides[0].description || '');
      setBannerImage(getBannerSlides[0].image || '');
      setBannerImageMobile(getBannerSlides[0].image_movil || '');
    };
    fetchBanner();
  }, []);
  return (
    <section className="w-full bg-cover bg-center bg-no-repeat mt-10 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${bannerImageMobile})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-6 py-16 text-white">
        <div className="w-[95%] mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {bannerTitle}
          </h1>
          <h5 className="text-base md:text-xl font-light md:w-2/5">
            {bannerDescription}
          </h5>
          <a
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_WHATSAPP_API_URL}`;
            }}
            className="flex items-center justify-between gap-3 bg-[#c41c1a] hover:bg-[#a91917] text-white font-medium py-3 px-6 rounded-md text-sm md:text-lg w-fit cursor-pointer"
          >
            <span>¡Pide aquí!</span>
            <BsWhatsapp className="text-xl" />
          </a>
        </div>
      </div>
    </section>
  );
}
