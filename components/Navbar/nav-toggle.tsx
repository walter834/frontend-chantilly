"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Ghost, Menu } from "lucide-react";
import NavLinks from "./nav-links";
import { useEffect, useState } from "react";
import useBreakpointer from "@/hooks/useBreakpointer";

export default function NavToggle() {
  const [open, setOpen] = useState(false);

  const width = useBreakpointer();

  useEffect(() => {
    if (width > 1024) {
      setOpen(false);
    }
  }, [width]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet open={open} onOpenChange={setOpen} >
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden ">
            <Menu className="size-[26px]" size={32}/>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-64 pt-12 bg-[#c41d1ada] backdrop-blur-3xl text-white " onClick={()=>setOpen(false) }>
          <SheetHeader>
            <SheetTitle>
              
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
        <div className="flex flex-col justify-center px-5 ">
        <NavLinks/>
        </div>
          
        </SheetContent>
      </Sheet>
    </div>
  );
}