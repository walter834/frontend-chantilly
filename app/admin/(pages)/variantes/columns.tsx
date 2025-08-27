"use client";

import { Button } from "@/components/common/Button";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

export interface Product {
  id: number;
  short_description: string;
 
}

export interface Variant {
  id: number;
  cod_fav: string;
  description: string;
  product: string;
}

export const columns: ColumnDef<Variant>[] = [
  {
    accessorKey: "id",
    header: "Codigo",
  },
  {
    accessorKey: "cod_fav",
    header: "Código de fabricación",
  },
  {
    accessorKey: "description",
    header: "Nombre",
  },
  {
    accessorKey: "product",
    header: "Producto",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const products = row.original;
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Dialog>
            <DialogTrigger className="cursor-pointer" asChild>
              <Image color="green" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Button>
      );
    },
  },
];
