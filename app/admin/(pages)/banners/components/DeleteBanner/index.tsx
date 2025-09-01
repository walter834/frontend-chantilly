import { Button } from "@/components/ui/button";
import { deleteBanner } from "@/service/bannerService";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
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
interface Props {
  id: number;

  bannerTitle?: string;
}

export default function DeleteBanner({ id, bannerTitle }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteBanner(id);
      toast.success("Banner eliminado correctamente");
      setIsOpen(false);

      if (typeof window !== 'undefined' && (window as any).refreshBannersTable) {
      (window as any).refreshBannersTable();
    }
    
    } catch (err) {
      console.error("Error al eliminar banner:", err);
      toast.error("No se pudo eliminar el banner. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar banner${
            bannerTitle ? ` "${bannerTitle}"` : ""
          }`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar banner?</AlertDialogTitle>
          <AlertDialogDescription>
            {bannerTitle ? (
              <>
                Estás a punto de eliminar el banner{" "}
                <strong>"{bannerTitle}"</strong>. Esta acción no se puede
                deshacer.
              </>
            ) : (
              "Esta acción no se puede deshacer. El banner será eliminado permanentemente."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
