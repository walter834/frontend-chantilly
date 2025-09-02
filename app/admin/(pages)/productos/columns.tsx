"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./FileUploadDialog";

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
  image: string; // imagen principal
  images: Image[]; // todas las imágenes
}

export interface Image {
  id: number;
  url: string;
  is_primary: number;
  sort_order: number;
}

export interface TypeProduct {
  id: number;
  name: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Imagenes",
    cell: ({ row }) => {
      const images = row.original.images;

      if (!images || images.length === 0) {
        return <div className="text-gray-400">Sin imágenes</div>;
      }

      return (
        <div className="flex gap-1 overflow-x-auto max-w-xs py-2">
          {images
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((image, index) => (
              <div key={image.id} className="relative flex-shrink-0">
                <img
                  src={image.url}
                  alt={`Imagen ${index + 1}`}
                  className="w-12 h-12 object-cover rounded border-2 border-transparent hover:border-blue-300 transition-colors"
                />
                {image.is_primary === 1 && (
                  <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    ★
                  </div>
                )}
              </div>
            ))}
        </div>
      );
    },
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
