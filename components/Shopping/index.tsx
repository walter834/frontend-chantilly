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
          className="cursor-pointer"
          onClick={() => window.dispatchEvent(new Event('open-cart'))}
        >
          <ShoppingCart size={26} />
          <span className="text-xs">{count || "0"}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="z-50">
      <Sheet open={open} onOpenChange={setOpen}>
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
