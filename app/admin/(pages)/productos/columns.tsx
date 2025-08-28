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
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
}

export interface TypeProduct {
  id: number;
  name: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "Codigo",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },

  {
    accessorKey: "product_type_name",
    header: "Tipo de producto",
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
