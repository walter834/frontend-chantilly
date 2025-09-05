"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { setPrimaryImage } from "@/service/product/customizeProductService";
import { FileUploadDialog } from "./FileUploadDialog";
import Image from "next/image";

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

export interface Variant {
  id: number;
  product_id: number;
  description: string;
  portions: string;
  price: string;
  hours: number;
  images: VariantImage[];
  primaryImage?: string;
}

export interface VariantImage {
  id: number;
  url: string;
  is_primary: number;
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

      const handleSetPrimary = async (
        imageIndex: number,
        currentPrimary: boolean
      ) => {
        if (currentPrimary) {
          return;
        }

        try {
          await setPrimaryImage(row.original.id, imageIndex);
          toast.success("Imagen principal actualizada");

          // Refrescar la tabla si existe la función global

          window.dispatchEvent(new CustomEvent("productUpdated"));
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
                <Image
                  width={30}
                  height={30}
                  src={image.url}
                  alt={`Imagen ${index + 1}`}
                  className={`w-12 h-12 object-cover rounded border-2 transition-all cursor-pointer ${image.is_primary === 1
                      ? "border-red-700"
                      : "border-transparent hover:border-red-500 hover:scale-105"
                  }`}
                  onClick={() =>
                    handleSetPrimary(index, image.is_primary === 1)
                  }
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
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },

  {
    accessorKey: "product_type_name",
    header: "Tipo de producto",
    cell: ({ row }) => {
      const productType = row.original.product_type_name;

      // Función para obtener los colores según el tipo de producto
      const getTypeColors = (type: string) => {
        const typeUpper = type.toUpperCase();

        switch (typeUpper) {
          case "BOCADITO":
            return {
              bg: "bg-red-100",
              text: "text-red-800",
              border: "border-red-200",
            };
          case "TORTA TEMATICA":
            return {
              bg: "bg-blue-100",
              text: "text-blue-800",
              border: "border-blue-200",
            };
          case "TORTA EN LINEA":
            return {
              bg: "bg-purple-100",
              text: "text-purple-800",
              border: "border-purple-200",
            };
          case "POSTRE":
            return {
              bg: "bg-pink-100",
              text: "text-pink-800",
              border: "border-pink-200",
            };
          case "ACCESORIO":
            return {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              border: "border-yellow-200",
            };

          default:
            return {
              bg: "bg-gray-100",
              text: "text-gray-800",
              border: "border-gray-200",
            };
        }
      };

      const colors = getTypeColors(productType);

      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {productType}
        </div>
      );
    },
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
