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

export default function Shopping() {
  /* const [open, setOpen] = useState(false);

  const width = useBreakpointer();

  useEffect(() => {
    if (width > 1024) {
      setOpen(false);
    }
  }, [width]); */

  return (
    <div className="z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            <ShoppingCart size={26} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
        >
          <SheetHeader className="bg-white">
            <SheetTitle className="text-black text-center">MI CARRITO</SheetTitle>
            <SheetDescription >
            </SheetDescription>
          </SheetHeader>
          <ShoppingList />
        </SheetContent>
      </Sheet>
    </div>
  );
}
