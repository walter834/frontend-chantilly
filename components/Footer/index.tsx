import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-10 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección Nosotros */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Nosotros</h3>
          <p>SOMOS CHANTILLY</p>
        </div>

        {/* Sección Redes Sociales */}
        <div className="text-center">
          <img
            src="/logo.png" // Asegúrate de tener esta imagen en public/
            alt="logo"
            className="mx-auto mb-2 w-12 h-12"
          />
          <h3 className="text-xl font-semibold mb-2">Redes sociales</h3>
          <div className="flex justify-center gap-4 text-2xl">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaTiktok />
            <FaWhatsapp />
          </div>
        </div>

        {/* Sección Métodos de Pago */}
        <div className="text-center md:text-right">
          <h3 className="text-xl font-semibold mb-4">Métodos de Pago</h3>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            <img src="/plin.png" alt="Plin" className="h-10" />
            <img src="/yape.png" alt="Yape" className="h-10" />
            <img src="/mastercard.png" alt="MasterCard" className="h-10" />
            <img src="/visa.png" alt="Visa" className="h-10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
