'use client';

import { useEffect, useState } from 'react';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from './button';
import { X } from 'lucide-react';

type DeliveryDateAlertProps = {
  open: boolean;
  onClose: () => void;
  deadline: Date;
  maxHours: number;
  products: Array<{
    name: string;
    hours: number;
    imageUrl?: string;
  }>;
};

export function DeliveryDateAlert({
  open,
  onClose,
  deadline,
  maxHours,
  products,
}: DeliveryDateAlertProps) {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  if (!isVisible) return null;

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };
  
  const adjustedDeadline = new Date(deadline);
  adjustedDeadline.setDate(adjustedDeadline.getDate() + 1);
  
  const formattedDeadline = formatDate(adjustedDeadline);
  const currentDate = new Date();
  console.log('formattedDeadline', formattedDeadline);
  console.log('deadline', deadline);
  console.log('adjustedDeadline', adjustedDeadline);
  console.log('currentDate', currentDate);
  
  const timeDiff = adjustedDeadline.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#c41c1a] flex items-center gap-2">
            <FaExclamationTriangle className="text-[#c41c1a]" />
            Tiempo de preparación requerido
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Algunos productos requieren tiempo de preparación. La fecha de entrega más temprana posible es:
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex flex-col gap-2 text-yellow-700">
              <div className="flex items-center gap-2">
                <FaClock className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Fecha límite: {formattedDeadline}</p>
                  <p className="text-sm">
                    {daysDiff > 1 
                      ? `Disponible en ${daysDiff} días (${maxHours} horas de preparación)`
                      : `Disponible mañana a las ${adjustedDeadline.getHours()}:${adjustedDeadline.getMinutes().toString().padStart(2, '0')} hrs`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Productos que requieren preparación:</h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {products.map((product, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">Tiempo de preparación: {product.hours} horas</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cerrar
          </Button>
          <Button
            onClick={() => {
              const dateInput = document.getElementById('date') as HTMLInputElement;
              if (dateInput) {
                dateInput.value = adjustedDeadline.toISOString().split('T')[0];
              }
              onClose();
            }}
            className="bg-[#c41c1a] hover:bg-[#c41c1a] cursor-pointer"
          >
            Usar esta fecha
          </Button>
        </div>
      </div>
    </div>
  );
}
