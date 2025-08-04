import React from 'react';

const menuItems = [
  { icon: '/imgs/icons/iconos-05.png', label: 'INFANTILES' },
  { icon: '/imgs/icons/iconos-03.png', label: 'MUJER' },
  { icon: '/imgs/icons/iconos-04.png', label: 'HOMBRE' },
  { icon: '/imgs/icons/iconos-07.png', label: 'BAUTIZO' },
  { icon: '/imgs/icons/iconos-06.png', label: 'PROFESIONES' },
  { icon: '/imgs/icons/iconos-13.png', label: 'ENAMORADOS' },
  { icon: '/imgs/icons/iconos-10.png', label: 'BABYSHOWER' },
];

export default function Menu() {
  return (
    <div className="overflow-x-auto flex justify-start gap-10 px-18 py-6 border-b border-gray-200 bg-white shadow-lg">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="group flex flex-col items-center min-w-fit cursor-pointer transition-all duration-200"
        >
          {/* Contenedor horizontal */}
          <div className="flex items-center px-2 py-1 gap-3">
            <img
              src={item.icon}
              alt={`Icono de ${item.label}`}
              className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] transition duration-300 group-hover:[filter:sepia(77%)_brightness(42%)_hue-rotate(314deg)_saturate(1000%)_contrast(104%)]"
            />
            <span className="text-[12px] sm:text-sm font-bold font-poppins text-[#828282] group-hover:text-[#c41c1a] transition whitespace-nowrap">
              {item.label}
            </span>
          </div>
          {/* Línea inferior al hacer hover */}
          <div className="h-[3px] w-full transition-all duration-300 scale-x-0 group-hover:scale-x-100 bg-[#c41c1a] origin-center"></div>
        </div>
      ))}
    </div>
  );
}
