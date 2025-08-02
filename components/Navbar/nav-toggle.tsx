import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import NavLinks from "./nav-links"

export default function NavToggle() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-12">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>

                <NavLinks />
                <SheetFooter>

                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
