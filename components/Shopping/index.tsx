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
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function Shopping() {
  /* const [open, setOpen] = useState(false);

  const width = useBreakpointer();

  useEffect(() => {
    if (width > 1024) {
      setOpen(false);
    }
  }, [width]); */

  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="">
            <ShoppingCart size={26} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:w-64 pt-12 bg-[#c41d1ada] backdrop-blur-3xl text-white "
        >
          <SheetHeader>
            <SheetTitle className="flex justify-center"></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          aea
        </SheetContent>
      </Sheet>
    </div>
  );
}
