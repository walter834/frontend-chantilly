"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import Register from "../RegisterForm/form";
import Login from "./form";
import Image from "next/image";

export default function LoginForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsRegister(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10">
          <User size={30} />
        </Button>
      </DialogTrigger>

      {/* Deshabilitamos el botón X por defecto con showCloseButton={false} */}
      <DialogContent 
        showCloseButton={false}
        className={`max-h-[90vh] overflow-y-auto p-0 ${
          isRegister 
            ? 'w-[95vw] max-w-2xl sm:max-w-3xl' 
            : 'w-[90vw] max-w-md sm:max-w-lg'
        }`}
      >
        
        {/* Header con logo y botón X personalizado */}
        <div className="bg-[#c41c1a] text-white px-4 sm:px-6 py-4 flex justify-center items-center relative">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-auto aspect-[320/50]">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 320px"
            />
          </div>
          
          {/* Botón X personalizado - más separado del borde */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-10"
            aria-label="Cerrar"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="sm:w-5 sm:h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <DialogTitle className="hidden" />

        {/* Contenido del formulario con padding responsivo */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className={isRegister ? 'w-full' : 'w-full max-w-sm mx-auto'}>
            {isRegister ? (
              <Register
                onBackToLogin={() => setIsRegister(false)}
                onCloseDialog={handleClose}
                onGoToLogin={() => setIsRegister(false)}
              />
            ) : (
              <Login
                onCloseDialog={handleClose}
                onOpenRegister={() => setIsRegister(true)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}