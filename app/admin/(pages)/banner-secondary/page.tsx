"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useBannerSecondary } from "@/hooks/useBannerSecondary";
import { Skeleton } from "@/components/ui/skeleton";

export default function BannerFooter() {
  const { data, isLoading, error } = useBannerSecondary();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">Error al cargar los banners</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
