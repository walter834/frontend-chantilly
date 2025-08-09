import React from 'react';
import Image from 'next/image';
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp
} from 'react-icons/fa6';

export default function Footer({ empresa = 'CHANTILLY' }) {
  return (
    <footer className="bg-[#c41c1a] text-white w-full py-6 pt-10">
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-12 items-start text-center">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-lg font-semibold">Nosotros</h1>
          <p className="text-sm leading-relaxed font-light max-w-[250px]">
            SOMOS {empresa}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <a href="#" className="hidden md:block">
            <Image
              src="/imgs/icons/icon-wthout-fondo.png"
              alt="Logo Footer"
              width={80}
              height={80}
              className="w-[20%] mx-auto"
            />
          </a>
          <h1 className="text-lg font-semibold">Redes sociales</h1>
          <div className="flex justify-center items-center gap-3 text-white text-xl">
            {[FaFacebook, FaInstagram, FaXTwitter, FaTiktok, FaWhatsapp].map((Icon, idx) => (
              <a href="#" key={idx} target="_blank" rel="noreferrer">
                <Icon className="w-7 h-7" />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-lg font-semibold">Métodos de Pago</h1>
          <div className="flex justify-center items-center gap-[3%] pt-2 flex-wrap">
            <Image src="/imgs/icons/icon-plin.png" alt="Plin" width={86} height={86} className="w-[16%]" />
            <Image src="/imgs/icons/icon-yape.png" alt="Yape" width={86} height={86} className="w-[15%]" />
            <Image src="/imgs/icons/icon-mastercard.png" alt="MasterCard" width={140} height={86} className="w-[25%]" />
            <Image src="/imgs/icons/icon-visa.png" alt="Visa" width={140} height={86} className="w-[23%]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
