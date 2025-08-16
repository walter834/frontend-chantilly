"use client";

import { Button } from "@/components/ui/button";
import ShoppingList from "@/components/ShoppingList";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Shopping({ showCount }: { showCount: boolean }) {
  const [count, setCount] = useState(0);
  const updateCount = () => {
    const cart = JSON.parse(localStorage.getItem("chantilly-cart") || '{"itemCount":0}');
    setCount(cart.itemCount || 0);
  };

  useEffect(() => {
    updateCount();

    const handleCartChange = () => {
      updateCount();
    };

    window.addEventListener("chantilly-cart-updated", handleCartChange);

    return () => {
      window.removeEventListener("chantilly-cart-updated", handleCartChange);
    };
  }, []);

  return (
    <div className="z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            <ShoppingCart size={26} />
            <span className="text-xs">{count || "0"}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="bg-white">
            <SheetTitle className="text-black text-center">MI CARRITO</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <ShoppingList />
        </SheetContent>
      </Sheet>
    </div>
  );
}
