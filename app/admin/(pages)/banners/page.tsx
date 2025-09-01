"use client";

import { columns } from "./columns";
import { getBanner, updateBannerOrder } from "@/service/bannerService";
import { DataTable } from "./data-table";
import { ApiBanner } from "@/types/api";
import { AddBanner } from "./components/AddBanner";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Banners() {
  const [data, setData] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async (): Promise<ApiBanner[]> => {
    try {
      const banners = await getBanner();
      // ✅ CRÍTICO: Ordenar por display_order
      return banners.sort((a, b) => a.display_order - b.display_order);
    } catch (error) {
      return [];
    }
  };
  const loadData = async () => {
    setLoading(true);
    const banners = await getData();
    setData(banners);
    setLoading(false);
  };

  const refreshData = async () => {
    const banners = await getData();
    setData(banners);
  };

  const handleReorderData = async (newData: ApiBanner[]) => {
    try {
      console.log(
        "Datos a enviar:",
        newData.map((b) => ({ id: b.id, display_order: b.display_order }))
      );

      // ✅ Actualizar estado local inmediatamente para feedback visual
      setData(newData);

      // ✅ Crear promesas de actualización
      const updatePromises = newData.map((banner) =>
        updateBannerOrder(banner.id, banner.display_order.toString())
      );

      // ✅ Ejecutar todas las actualizaciones
      await Promise.all(updatePromises);

      toast.success("Orden actualizado correctamente");
      console.log("✅ Todas las actualizaciones completadas");
    } catch (error) {
      console.error("❌ Error al actualizar orden:", error);
      toast.error("Error al actualizar el orden");
      // ✅ Revertir cambios si falla
      await refreshData();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).refreshBannersTable = refreshData;
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div>Cargando...</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        onReorderData={handleReorderData}
      />
    </div>
  );
}
