import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/hooks/useAuth";
import { CircleUser, LogOut, ShoppingBasket, Watch } from "lucide-react";
import Link from "next/link";

export default function UserDrop() {
  const { name, logoutUser } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="border-2 border-yellow-300 text-yellow-300 rounded-full w-[40px] h-[40px] hover:bg-yellow-300 hover:text-red-800"
        >
          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              Perfil
              <DropdownMenuShortcut>
                <CircleUser />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem>
              Mis compras
              <DropdownMenuShortcut>
                <ShoppingBasket />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="w-full text-sm cursor-pointer px-2 py-1 rounded-md hover:text-red-500  transition-colors flex items-center justify-between">
                Cerrar sesión
                <DropdownMenuShortcut>
                  <LogOut size={14} />
                </DropdownMenuShortcut>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que quieres cerrar sesión? Tendrás que
                  iniciar sesión nuevamente para acceder a tu cuenta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={logoutUser}>
                  Sí, cerrar sesión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
