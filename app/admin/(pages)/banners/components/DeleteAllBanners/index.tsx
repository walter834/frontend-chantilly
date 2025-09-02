import { Button } from "@/components/ui/button";
import { deleteAllBanners } from "@/service/bannerService";
import { BrushCleaning, Loader2, Trash } from "lucide-react";
import React, { useState } from "react";

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

export const AllDeleteBanners = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  async function handleDeleteAll() {
    try {
      setIsDeleting(true);
      await deleteAllBanners();
      if (
        typeof window !== "undefined" &&
        (window as any).refreshBannersTable
      ) {
        (window as any).refreshBannersTable();
      }
      setIsOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
        >
          Borrar todo
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar todo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Todos los banners serán eliminados
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAll}
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
};

export default AllDeleteBanners;
