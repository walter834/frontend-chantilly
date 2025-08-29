"use client";

import { Button } from "@/components/common/Button";

import { ApiBanner } from "@/types/api";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./components/FileUploadDialog";
import DeleteBanner from "./components/DeleteBanner";
import Image from "next/image";

export const columns: ColumnDef<ApiBanner>[] = [
  {
    accessorKey: "id",
    header: "Código",
  },
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({row}) => {
      const image = row.original.image_url;
      return (
        <div>
          <Image src={`${image}`} width={160} height={40} alt="image_banner" className="rounded-sm"/>
        </div>
      )
    }
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
        <div className="flex gap-2 items-center">
          <FileUploadDialog id={banner.id} />
          <DeleteBanner id={banner.id}  />
        </div>
      );
    },
  },
];
