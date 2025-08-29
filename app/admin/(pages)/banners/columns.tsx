"use client";

import { Button } from "@/components/common/Button";

import { ApiBanner } from "@/types/api";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./FileUploadDialog";

export const columns: ColumnDef<ApiBanner>[] = [
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
    accessorKey: "display_order",
    header: "Número de orden",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <FileUploadDialog id={banner.id}/>
      );
    },
  },
];
