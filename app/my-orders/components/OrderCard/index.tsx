// components/OrderCard.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package } from "lucide-react";

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


const formatMoney = (v: string | number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(Number(v));

const formatDate = (s: string) => {
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "long", year: "numeric" })
    .format(new Date(iso));
};

export function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items?.[0];
  const orderNo = order.order_number ?? String(order.id).padStart(4, "0");

  return (
    <div className="w-full px-4">
      <Card className="bg-white rounded-lg shadow-lg w-full mx-auto p-6 sm:p-6 max-w-xl md:max-w-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base font-medium">
            {formatDate(order.order_date)}
          </span>
          <span className="text-lg sm:text-xl font-bold">{formatMoney(order.total)}</span>
        </div>

        <Separator className="my-0" />

        <div className="flex flex-col md:flex-row w-full justify-between">
          <div>
            {/* Order Number */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-red-500 font-bold text-sm sm:text-lg">Compra N° {orderNo}</h2>
            </div>

            {/* Product Section */}
            <div className="flex gap-4 mb-6">
              {/* Product Image (placeholder) */}
              <div className="flex-shrink-0">
                <img
                  src="/alianza-lima-jersey-cake.png"
                  alt="Producto"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">
                  {firstItem ? `${firstItem.quantity} x Producto` : "Sin items"}
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  {firstItem?.delivery_date && (
                    <p>
                      <span className="font-medium">Fecha Recojo:</span>{" "}
                      {formatDate(firstItem.delivery_date + " 00:00")}
                    </p>
                  )}
                  {firstItem?.dedication_text && (
                    <p>
                      <span className="font-medium">Dedicatoria:</span>{" "}
                      {firstItem.dedication_text}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Medio de pago:</span>{" "}
                    {order.payment_method ?? "—"}
                  </p>
                  <p>
                    <span className="font-medium">Estado de pago:</span>{" "}
                    {order.payment_status === "pending" ? "Pendiente" : order.payment_status}
                  </p>
                </div>

                <div className="mt-2">
                  <span className="font-bold text-lg">
                    {firstItem ? formatMoney(firstItem.subtotal) : formatMoney(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
                  
                  
          {/* Delivery Information (estático si tu API no lo trae aún) */}
          <div className="pt-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Package className="w-4 h-4" />
                <span className="font-bold">Tipo de Entrega</span>
              </div>
              <p className="text-gray-700 ml-6">RECOJO EN TIENDA</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-bold">Tienda</span>
              </div>
              <div className="ml-6 text-gray-700">
                <p className="font-medium">LA CASA DEL CHANTILLY - HABICH</p>
                <p className="text-sm">
                  {order.local_id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
