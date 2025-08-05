import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaWhatsapp
} from 'react-icons/fa6';

export default function Footer({ empresa = 'COMAS' }) {
  return (
    <footer className="bg-[#c41c1a] text-white w-full py-6">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-12 items-start text-center">
        {/* Nosotros */}
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-lg font-semibold">Nosotros</h1>
          <p className="text-sm leading-relaxed font-light max-w-[250px]">
            SOMOS CHANTILLY
          </p>
        </div>

        {/* Redes Sociales */}
        <div className="flex flex-col items-center space-y-4">
          {/* Este ícono se oculta en pantallas móviles */}
          <a href="#" className="hidden md:block">
            <img
              src="imgs/icons/icon-wthout-fondo.png"
              alt="Logo Footer"
              className="w-[20%] mx-auto"
            />
          </a>
          <h1 className="text-lg font-semibold">Redes sociales</h1>
          <div className="flex justify-center items-center gap-3 text-white text-xl">
            {[FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaWhatsapp].map((Icon, idx) => (
              <a href="#" key={idx} target="_blank" rel="noreferrer">
                <Icon className="w-7 h-7" />
              </a>
            ))}
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-lg font-semibold">Métodos de Pago</h1>
          <div className="flex justify-center items-center gap-[3%] pt-2 flex-wrap">
            <img src="imgs/icons/icon-plin.png" alt="Plin" className="w-[7%] min-w-[30px]" />
            <img src="imgs/icons/icon-yape.png" alt="Yape" className="w-[7%] min-w-[30px]" />
            <img src="imgs/icons/icon-mastercard.png" alt="MasterCard" className="w-[7%] min-w-[30px]" />
            <img src="imgs/icons/icon-visa.png" alt="Visa" className="w-[7%] min-w-[30px]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
