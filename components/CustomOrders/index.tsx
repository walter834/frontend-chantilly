'use client';
import { BsWhatsapp } from 'react-icons/bs';

export default function CustomOrders() {
  return (
    <section className="w-full bg-cover bg-center bg-no-repeat mt-10 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/fondo-banner2.jpg')" }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url('/banner2.jpg')" }}
      />
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-white">
        <div className="w-[95%] mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            ¡Pedidos Personalizados!!
          </h1>
          <h5 className="text-base md:text-xl font-light md:w-2/5">
            Personaliza tu producto con nosotros, mándanos tu diseño y descripción de lo que necesites, nuestro equipo te ayudará con la cotización del producto.
          </h5>
          <button
            onClick={() => {
              window.location.href =
                'https://api.whatsapp.com/send?phone=+51955122100&text=Quisiera%20hacer%20un%20pedido...';
            }}
            className="flex items-center justify-between gap-3 bg-[#c41c1a] hover:bg-[#a91917] text-white font-medium py-3 px-6 rounded-md text-sm md:text-lg w-fit"
          >
            <span>¡Pide aquí!</span>
            <BsWhatsapp className="text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
}
