"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileUploadDialog } from "./FileUploadDialog";

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
      const variant = row.original;
      return <FileUploadDialog id={variant.id} />;
    },
  },
];
