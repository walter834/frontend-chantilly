"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { setPrimaryImage } from "@/service/product/customizeProductService";
import { FileUploadDialog } from "./FileUploadDialog";

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  product_type_name: string;
  image: string; 
  images: Image[]; 
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

      const handleSetPrimary = async (imageIndex: number, currentPrimary: boolean) => {
        if (currentPrimary) {
          return;
        }

        try {
          await setPrimaryImage(row.original.id, imageIndex);
          toast.success("Imagen principal actualizada");
          
          if (typeof window !== "undefined" && (window as any).refreshProductsTable) {
            (window as any).refreshProductsTable();
          }
        } catch (error) {
          toast.error("Error al establecer imagen principal");
          console.error("Error:", error);
        }
      };
      
      return (
        <div className="flex gap-1 overflow-x-auto max-w-xs py-2">
          {images
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((image, index) => (
              <div key={image.id} className="relative flex-shrink-0">
                <img
                  src={image.url}
                  alt={`Imagen ${index + 1}`}
                  className={`w-12 h-12 object-cover rounded border-2 transition-all cursor-pointer ${
                    image.is_primary === 1
                      ? "border-red-700"
                      : "border-transparent hover:border-red-500 hover:scale-105"
                  }`}
                  onClick={() => handleSetPrimary(index, image.is_primary === 1)}
                  title={
                    image.is_primary === 1
                      ? "Imagen principal actual"
                      : "Click para establecer como principal"
                  }
                />
                {image.is_primary === 1 && (
                  <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
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