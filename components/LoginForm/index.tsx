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
import Register from "../RegisterForm/form"; // Importa directamente el form real
import Login from "./form";
import Link from "next/link";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";

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

      <DialogContent className="max-h-[99vh] overflow-y-auto p-10">
        {/* Header */}
        <div className="bg-[#c41c1a] text-white px-6 py-4  flex justify-center items-center">
          <div className="relative w-full max-w-[320px] h-auto aspect-[320/50] ">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              className="object-contain "
              sizes="(max-width: 768px) 80vw, 320px"
            />
          </div>
        </div>
        <DialogTitle className="hidden" />

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
      </DialogContent>
    </Dialog>
  );
}
