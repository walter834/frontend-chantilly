import React from 'react';

interface LoadingProps {
  text: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="text-sm">{text}</p>
        <p className="text-xs opacity-80">Por favor, espera mientras se carga la información.</p>
      </div>
    </div>
  );
}