'use client';
import { toast } from 'sonner';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from 'react-icons/fa6';

// Definimos la paleta de colores de la marca "La Casa del Chantilly"
const brandColors = {
  red: '#d62828', // Rojo oscuro de la marca
  yellow: '#f4a261', // Amarillo/naranja mostaza de la marca
  white: '#fefefe', // Blanco
};

const alertConfig = {
  success: {
    icon: FaCircleCheck,
    textColor: 'text-green-800',
    bgColor: 'bg-green-50',
  },
  warning: {
    icon: FaTriangleExclamation,
    textColor: `text-[${brandColors.yellow}]`,
    bgColor: `bg-yellow-50`, // Usamos un tono más claro del amarillo para el fondo
  },
  error: {
    icon: FaCircleExclamation,
    textColor: `text-[${brandColors.red}]`,
    bgColor: `bg-red-50`, // Usamos un tono más claro del rojo para el fondo
  },
  info: {
    icon: FaCircleInfo,
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-50',
  },
};

type Status = keyof typeof alertConfig;
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export const CustomAlert = (text: string, status: Status, position: Position) => {
  const { icon: Icon, textColor, bgColor } = alertConfig[status] || alertConfig.info;

  toast.custom((t) => (
    <div
      className={`
        flex items-center gap-3
        p-4 rounded-lg
        ${bgColor} ${textColor}
        font-semibold
      `}
    >
      <Icon className="text-xl shrink-0" />
      <p className="text-sm md:text-base">{text}</p>
    </div>
  ), { position });
};