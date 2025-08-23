// components/OrderCard.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Order, OrderItem } from "@/types/order";
import { MapPin, Package } from "lucide-react";

const formatMoney = (v: string | number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    Number(v)
  );

const formatDate = (s: string) => {
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
};

export function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items?.[0];
  const orderNo = order.order_number ?? String(order.id).padStart(4, "0");

  // Obtener el nombre del producto de la manera más específica posible
  const getProductName = (item: OrderItem | undefined) => {
    if (!item) return "Sin items";

    if (item.product_variant?.description) {
      return `${item.quantity} x ${item.product_variant.description}`;
    }

    if (item.product?.short_description) {
      return `${item.quantity} x ${item.product.short_description}`;
    }

    return `${item.quantity} x Producto`;
  };

  return (
    <div className="w-full px-4">
      <Card className="bg-white rounded-2xl shadow-xl border-0 w-full mx-auto p-0 max-w-xl md:max-w-4xl lg:max-w-6xl overflow-hidden">
        <div className="bg-[#c41d1ada] px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/90 text-sm sm:text-base font-medium">
              {formatDate(order.order_date)}
            </span>
            <span className="text-white text-xl sm:text-2xl font-bold bg-white/10 px-4 py-2 rounded-full">
              {formatMoney(order.total)}
            </span>
          </div>
        </div>

        <div className="px-1 sm:p-8">
          <div className="flex flex-col lg:flex-row w-full justify-between gap-8 ">
            <div className="flex-1">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h2 className="text-red-600 font-bold text-lg">
                    Compra N° {orderNo}
                  </h2>
                </div>
              </div>

              <div className="flex gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={firstItem?.image_url || "./avatar.jpeg"}
                      alt="Producto"
                      className="w-28 h-28 rounded-xl object-cover border-2 border-red-100"
                      onError={(e) => {
                        e.currentTarget.src = "/";
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                    {getProductName(firstItem)}
                  </h3>

                  {firstItem?.product_variant && (
                    <div className="mb-4">
                      <div className="flex gap-4 text-sm text-gray-600">
                        {firstItem.product_variant.portions && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            <span className="text-red-500">📏</span>{" "}
                            {firstItem.product_variant.portions}
                          </span>
                        )}
                        {firstItem.product_variant.size_portion && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            <span className="text-red-500">🍰</span>{" "}
                            {firstItem.product_variant.size_portion}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-red-600 text-xs uppercase tracking-wide">
                          Comprobante
                        </span>
                        <span className="text-gray-800 font-medium">
                          {order.voucher_type || "FACTURA"}
                        </span>
                      </div>
                      {firstItem?.delivery_date && (
                        <div className="flex flex-col">
                          <span className="font-semibold text-red-600 text-xs uppercase tracking-wide">
                            Fecha Recojo
                          </span>
                          <span className="text-gray-800 font-medium">
                            {formatDate(firstItem.delivery_date + " 00:00")}
                          </span>
                        </div>
                      )}
                    </div>

                    {firstItem?.dedication_text && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="font-semibold text-red-600 text-xs uppercase tracking-wide block mb-1">
                          Dedicatoria
                        </span>
                        <span className="text-gray-800 italic">
                          "{firstItem.dedication_text}"
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-red-600 text-xs uppercase tracking-wide">
                          Medio de pago
                        </span>
                        <span className="text-gray-800 font-medium">
                          {order.payment_method ?? "—"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-red-600 text-xs uppercase tracking-wide">
                          Estado de pago
                        </span>
                        <span
                          className={`font-medium ${
                            order.payment_status === "pending"
                              ? "text-amber-600"
                              : "text-gray-800"
                          }`}
                        >
                          {order.payment_status === "pending"
                            ? "Pendiente"
                            : order.payment_status ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {order.billing_data && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100">
                      <h4 className="font-bold text-red-600 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Datos de Facturación
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            RUC:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {order.billing_data.ruc}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Razón Social:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {order.billing_data.razon_social}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-600">
                            Dirección:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {order.billing_data.tax_address}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Subtotal:
                      </span>
                      <span className="font-bold text-2xl text-red-600">
                        {firstItem
                          ? formatMoney(firstItem.subtotal)
                          : formatMoney(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 min-w-[300px]">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-red-600 mb-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">Tipo de Entrega</span>
                  </div>
                  <div className="ml-11">
                    <span className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      RECOJO EN TIENDA
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-red-600 mb-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">Tienda</span>
                  </div>
                  <div className="ml-11 text-gray-700 space-y-2">
                    <p className="font-bold text-gray-900 text-lg">
                      {order.local.name}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">{order.local.address}</p>
                      <p className="text-gray-600">
                        {order.local.district}, {order.local.province}
                      </p>
                      {order.local.start_time && order.local.end_time && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 font-medium">
                            <span className="text-red-500">🕒</span> Horario:{" "}
                            {order.local.start_time.slice(0, 5)} -{" "}
                            {order.local.end_time.slice(0, 5)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
