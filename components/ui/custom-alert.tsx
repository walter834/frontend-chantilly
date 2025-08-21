'use client';
import { toast } from 'sonner';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from 'react-icons/fa6';

// Define the valid alert statuses and their corresponding configurations
const alertConfig = {
  success: {
    icon: FaCircleCheck,
    color: 'text-[#4ade80]', // A green color
    borderColor: 'border-[#4ade80]',
  },
  warning: {
    icon: FaTriangleExclamation,
    color: 'text-[#facc15]', // A yellow color
    borderColor: 'border-[#facc15]',
  },
  error: {
    icon: FaCircleExclamation,
    color: 'text-[#ef4444]', // A red color
    borderColor: 'border-[#ef4444]',
  },
  info: {
    icon: FaCircleInfo,
    color: 'text-[#3b82f6]', // A blue color
    borderColor: 'border-[#3b82f6]',
  },
};

type Status = keyof typeof alertConfig;
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export const CustomAlert = (text: string, status: Status, position: Position) => {
  // Get the icon and color based on the status, defaulting to 'info' if the status is not found
  const { icon: Icon, color, borderColor } = alertConfig[status] || alertConfig.info;

  toast.custom((t) => (
    <div className={`flex items-center gap-2 bg-white text-black shadow-lg font-semibold p-4 h-20 border rounded-lg border-[2px] ${borderColor}`}>
      <Icon className={`text-xl ${color}`} />
      <p>{text}</p>
    </div>
  ), { position });
};