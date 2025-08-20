'use client';
import { toast } from 'sonner';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export const CustomAlert = (text: string, status: string, position: Position) => {
    return (
        <div>
           {toast.custom((t) => (
            <div className="flex items-center gap-2 bg-white text-black shadow-lg font-semibold p-2 h-20 border rounded-lg border-[#c41c1a] border-[2px]">
              {status === 'success' ? <FaCircleCheck className="text-[#c41c1a]" /> : <FaCircleExclamation className="text-[#c41c1a]" />}
              <p>{text}</p>
            </div>
          ), { position: position as Position })}
        </div>
    );
};