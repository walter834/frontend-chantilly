"use client";

import { Button } from "@/components/ui/button";
import ShoppingList from "@/components/ShoppingList";
import { PiShoppingCartSimpleFill } from "react-icons/pi";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Shopping({ showCount, isPrimary = true }: { showCount: boolean; isPrimary?: boolean }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const openedFromQueryRef = useRef(false);
  const updateCount = () => {
    const cart = JSON.parse(localStorage.getItem("chantilly-cart") || '{"itemCount":0}');
    setCount(cart.itemCount || 0);
  };

  const handleCartChange = useCallback(() => {
    updateCount();
  }, []);

  const handleOpenCart = useCallback(() => setOpen(true), []);

  useEffect(() => {
    updateCount();

    window.addEventListener("chantilly-cart-updated", handleCartChange);

    if (isPrimary) {
      window.addEventListener('open-cart', handleOpenCart as EventListener);

      try {
        const url = new URL(window.location.href);
        const shouldOpen = url.searchParams.get('openCart') === '1';
        if (shouldOpen && !openedFromQueryRef.current) {
          openedFromQueryRef.current = true;
          setOpen(true);
          url.searchParams.delete('openCart');
          window.history.replaceState({}, '', url.toString());
        }
      } catch { }
    }

    return () => {
      window.removeEventListener("chantilly-cart-updated", handleCartChange);
      if (isPrimary) {
        window.removeEventListener('open-cart', handleOpenCart as EventListener);
      }
    };
  }, [handleCartChange, handleOpenCart, isPrimary]);

  if (!isPrimary) {
    return (
      <div className="z-50">
        <Button
          variant="ghost"
          className="cursor-pointer relative border border-[2px] border-yellow-300 rounded-full h-10 w-10 hover:bg-yellow-300"
          onClick={() => window.dispatchEvent(new Event('open-cart'))}
        >
          <PiShoppingCartSimpleFill size={26} className="text-yellow-300"  />
          <span className="absolute font-bold rounded-full h-4 w-4 top-0 right-0 bg-yellow-300 text-xs text-[#c41c1a] hover:bg-yellow-300 hover:text-[#c41c1a]">{count || "0"}</span>
        </Button>
      </div>
    );
  }
  return (
    <div className="z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="cursor-pointer relative border border-[2px] border-yellow-300 rounded-full h-10 w-10 hover:bg-[#c41c1a]">
            <PiShoppingCartSimpleFill size={26} className="text-yellow-300 hover:text-[#c41c1a]" />
            <span className="absolute font-bold rounded-full h-4 w-4 top-0 right-0 bg-yellow-300 text-xs text-[#c41c1a]">{count || "0"}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="bg-[#c41c1a] text-white">
            <SheetTitle className="text-center font-bold text-white">MI CARRITO</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <ShoppingList />
        </SheetContent>
      </Sheet>
    </div>
  );
}

