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
        <button
          className="relative rounded-full h-10 w-10 hover:bg-[#c41c1a]"
          onClick={() => window.dispatchEvent(new Event('open-cart'))}
        >
          <PiShoppingCartSimpleFill size={40} className="text-yellow-300"  />
          <span className="absolute font-bold rounded-full h-5 w-5 top-1 right-2 left-6 bg-[#c41c1a] text-xs text-yellow-300 border border-[2px] border-yellow-300">{count || "0"}</span>
        </button>
      </div>
    );
  }
  return (
    <div className="z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button onClick={() => setOpen(true)} className="cursor-pointer relative rounded-full h-10 w-10 hover:bg-[#c41c1a]">
            <PiShoppingCartSimpleFill size={40} className="text-yellow-300" />
            <span className="absolute font-bold rounded-full h-5 w-5 top-1 right-2 left-6 bg-[#c41c1a] text-xs text-yellow-300 border border-[2px] border-yellow-300">{count || "0"}</span>
          </button>
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

