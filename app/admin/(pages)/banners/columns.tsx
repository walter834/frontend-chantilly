"use client";

import { Button } from "@/components/common/Button";

import { ApiBanner } from "@/types/api";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

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
      const actions = row.original;
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Dialog>
            <DialogTrigger className="cursor-pointer" asChild>
              <Image color="green" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Button>
      );
    },
  },
];
