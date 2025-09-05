"use client"
import {
  getProducts,
} from "@/service/product/customizeProductService";
import { columns, Product } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

export default function Products() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async (): Promise<Product[]> => {
    try {
      return await getProducts();
    } catch (error) {
      return [];
    }
  };

  const loadData = async () => {
    setLoading(true);
    const products = await getData();
    setData(products);
    setLoading(false);
  };

  const refreshData = async () => {
    const products = await getData();
    setData(products);
  };

  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    const handleProductUpdate = () => {
      refreshData();
    };

    window.addEventListener("productUpdated", handleProductUpdate);

    return () => {
      window.removeEventListener("productUpdated", handleProductUpdate);
    };
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