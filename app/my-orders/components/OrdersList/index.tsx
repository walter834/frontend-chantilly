// components/orders/OrdersList.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OrderCard } from "../OrderCard";
import { getCostumerOrders, getOrders } from "@/service/order/orderService";
import { Order } from "@/types/order";

interface OrdersListProps {
  searchQuery: string;
  dateFilter?: string;
}

export default function OrdersList({
  searchQuery,
  dateFilter,
}: OrdersListProps) {
  const { isAuthenticated, customerId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !customerId) return;

    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        let data: Order[] = [];

        // ✅ Lógica más clara para determinar cuándo usar filtros
        const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
        const hasDateFilter = dateFilter && dateFilter.trim().length > 0;
        const hasAnyFilter = hasSearchQuery || hasDateFilter;

        if (hasAnyFilter) {
          // ✅ Si hay cualquier filtro activo, usar getOrders
          data = await getOrders({
            customerId: customerId,
            orderNumber: hasSearchQuery ? searchQuery.trim() : undefined,
            dateFilter: hasDateFilter ? dateFilter : undefined,
          });
        } else {
          // ✅ Si no hay filtros, mostrar todas las órdenes del cliente
          data = await getCostumerOrders(customerId);
        }

        if (active) setOrders(data);
      } catch (e: any) {
        if (active) setErr(e?.message ?? "Error al cargar pedidos");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated, customerId, searchQuery, dateFilter]);

  if (!isAuthenticated)
    return <p className="px-4">Inicia sesión para ver tus pedidos.</p>;
  if (loading) return  <div className="mt-10 flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c41d1ada]"></div>
          <span className="text-gray-600 text-sm">Cargando...</span>
        </div>
      </div>;
  if (err) return <p className="px-4 text-red-600">{err}</p>;

  // ✅ Verificar filtros activos de manera más limpia
  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  const hasDateFilter = dateFilter && dateFilter.trim().length > 0;
  const hasAnyFilter = hasSearchQuery || hasDateFilter;

  if (orders.length === 0) {
    if (hasAnyFilter) {
      let message = "No se encontraron pedidos";
      if (hasSearchQuery && hasDateFilter) {
        message += ` con ese número de orden y filtro de fecha`;
      } else if (hasSearchQuery) {
        message += ` con ese número de orden`;
      } else if (hasDateFilter) {
        message += ` para el período seleccionado`;
      }
      return <p className="px-4">{message}.</p>;
    }
    return <p className="px-4">Aún no tienes pedidos.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ Mostrar información de filtros activos */}
      {hasAnyFilter && (
        <div className="px-4 text-sm text-gray-600">
          <p>
            Mostrando {orders.length} resultado{orders.length !== 1 ? "s" : ""}
            {hasSearchQuery && ` para: "${searchQuery}"`}
            {hasSearchQuery && hasDateFilter && ` • `}
            {hasDateFilter && (
              <>
                {dateFilter === "ultimos_30_dias" && "últimos 30 días"}
                {dateFilter === "ultimos_3_meses" && "últimos 3 meses"}
                {dateFilter === "ultimos_6_meses" && "últimos 6 meses"}
                {dateFilter === "2025" && "año 2025"}
              </>
            )}
          </p>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
