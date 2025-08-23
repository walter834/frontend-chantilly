// components/orders/OrdersList.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OrderCard } from "../OrderCard";
import { getCostumerOrders } from "@/service/order/orderService";

export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id?: number;
  product_id?: number;
  cake_flavor_id?: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  dedication_text: string | null;
  delivery_date: string; 
}

export interface Order {
  id: number;
  customer_id: number;
  order_number: string | null;
  voucher_type: string | null;
  billing_data: any | null;
  local_id: number | null;
  subtotal: string;
  total: string;
  order_date: string; // "YYYY-MM-DD HH:mm"
  status: boolean;
  payment_method: string | null;
  payment_status: string | null; // puede venir null
  paid_at: string | null;
  items: OrderItem[];
}


export default function OrdersList() {
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
        const data = await getCostumerOrders(Number(customerId));
        if (active) setOrders(data);
      } catch (e: any) {
        if (active) setErr(e?.message ?? "Error al cargar pedidos");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [isAuthenticated, customerId]);

  if (!isAuthenticated) return <p className="px-4">Inicia sesión para ver tus pedidos.</p>;
  if (loading) return <p className="px-4">Cargando…</p>;
  if (err) return <p className="px-4 text-red-600">{err}</p>;
  if (orders.length === 0) return <p className="px-4">Aún no tienes pedidos.</p>;

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
