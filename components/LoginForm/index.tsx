"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";
import Register from "../RegisterForm/form"; // Importa directamente el form real
import Login from "./form";

export default function LoginForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsRegister(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10">
          <User size={30} />
        </Button>
      </DialogTrigger>

      <DialogContent className=" max-w-[700px]">
        <DialogTitle></DialogTitle>
        {isRegister ? (
          <Register
            onBackToLogin={() => setIsRegister(false)}
            onCloseDialog={handleClose}
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
