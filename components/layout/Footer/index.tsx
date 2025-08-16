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
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-12 items-start">
        <div className="flex flex-col items-start text-left space-y-2">
          <h1 className="text-lg font-semibold">Nosotros</h1>
          <p className="text-sm md:text-base leading-relaxed max-w-[60ch]">
          Somos una empresa apasionada en elaboracion y venta de tortas, postres y bocaditos.
                        Así mismo ofrecemos la mejor calidad entre otros.
                    
                
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <a href="#" className="hidden md:block">
            <Image
              src="/imgs/icons/icon-wthout-fondo.png"
              alt="Logo Footer"
              width={120}
              height={120}
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
        <div className="flex flex-col items-center text-center space-y-4">
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
