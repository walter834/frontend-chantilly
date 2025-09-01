"use client"

import { columns } from "./columns";
import { getBanner } from "@/service/bannerService";
import { DataTable } from "./data-table";
import { ApiBanner } from "@/types/api";
import { AddBanner } from "./components/AddBanner";
import { use, useEffect, useState } from "react";

export default function Banners() {
  const [data, setData] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async (): Promise<ApiBanner[]> => {
    try {
      return await getBanner();
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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
