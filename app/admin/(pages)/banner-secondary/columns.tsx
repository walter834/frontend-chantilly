"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./FileUploadDialog";
import { BannerSecondary } from "@/service/bannerFooter/bannerFooterService";
import { truncateText } from "@/lib/utils";

export const columns: ColumnDef<BannerSecondary>[] = [
  {
    accessorKey: "id",
    header: "Código",
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <span
          className={
            !description || description.trim() === ""
              ? "text-gray-500 italic"
              : ""
          }
        >
          {!description || description.trim() === ""
            ? "No tiene descripción"
            : truncateText(description, 50)}
        </span>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const bannerSecondary = row.original;
      const banner = {
        id: bannerSecondary.id,
        title: bannerSecondary.title,
        description: bannerSecondary.description,
        image: bannerSecondary.image,
        image_movil: bannerSecondary.image_movil,
      }
      console.log('banner', banner);
      return <FileUploadDialog {...banner} />;
    },
  },
];
