import Image from "next/image";
import { Button } from "../ui/button";
import { BsWhatsapp } from "react-icons/bs";

export default function CustomOrders() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden mt-10">
      {/* Imagen de fondo */}
      <Image
        src="/banner2.jpg" // Asegúrate de poner la imagen en /public/images/
        alt="Pedidos personalizados"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Contenido encima */}
      <div className="relative z-20 items-center max-w-7xl w-full h-full px-6 md:px-12 mt-16">
        {/* Texto a la izquierda */}
        <div className="w-full text-white">
          <h2 className="text-3xl md:text-7xl font-bold">
            ¡Pedidos Personalizados!
          </h2>
          <p className="mb-20 text-gray-300 text-base md:text-4xl mt-10 font-semibold">
            Personaliza tu producto con nosotros, mándanos tu diseño y
            descripción de lo que necesites, nuestro equipo te ayudará con la
            cotización del producto.
          </p>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-8 px-6 rounded inline-flex items-center text-sm   md:text-2xl">
            <BsWhatsapp className="size-10" />
            ¡Pide aquí!
          </Button>
        </div>
      </div>
    </section>
  );
}
