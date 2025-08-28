"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./FileUploadDialog";
import { BannerSecondary } from "@/service/bannerFooter/bannerFooterService";

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
            : description}
        </span>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const bannerSecondary = row.original;
      return <FileUploadDialog id={bannerSecondary.id} />;
    },
  },
];
