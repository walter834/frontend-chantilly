"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./FileUploadDialog";

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
  image: string;
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
    accessorKey: "image",
    header: "Imagen",
    cell: ({row}) =>{
      const url = row.original.image
      return (
        <img src={url} alt="preview " className="w-16 h-16 object-cover rounded-full"/>
      )
    }
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
      const product = row.original;
      return <FileUploadDialog id={product.id} />;
    },
  },
];
