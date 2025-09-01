"use client";

import { Button } from "@/components/common/Button";

import { ApiBanner } from "@/types/api";

import { ColumnDef } from "@tanstack/react-table";

import { FileUploadDialog } from "./components/FileUploadDialog";
import DeleteBanner from "./components/DeleteBanner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ApiBanner>[] = [
  {
    accessorKey: "image",
    header: ({ column }) => (
      <div className="text-left font-semibold text-gray-700 px-5">Imagen</div>
    ),
    cell: ({ row }) => {
      const image = row.original.image_url;
      return (
        <div className="px-5">
          <Image
            src={`${image}`}
            width={160}
            height={40}
            alt="image_banner"
            className="rounded-sm"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 border-green-200"
      >
        {row.original.status}
      </Badge>
    ),
  },

  {
    id: "actions",
    header: ({ column }) => (
      <div className="text-left font-semibold text-gray-700 px-5 flex justify-end">
        Acciones
      </div>
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <div className="flex gap-2 items-center justify-end px-5">
          <FileUploadDialog id={banner.id} />
          <DeleteBanner id={banner.id} />
        </div>
      );
    },
  },
];
