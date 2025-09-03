// components/OrderCard.tsx
"use client";
import { Card } from "@/components/ui/card";
import { getProductById } from "@/service/productService";
import { Order, OrderItem } from "@/types/order";

import {
  BanknoteArrowUp,
  Cake,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Ruler,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const orderNo = order.order_number.padStart(4, "0");

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

  async function datailProducts(id: number) {
    let response = await getProductById(id);
    router.push(response?.product_link || "");
  }

  return (
    <div className="w-full px-4 lg:px-40">
      <Card className="bg-white rounded-2xl shadow-xl border-0 gap-0 w-full mx-auto p-0 max-w-4xl md:max-w-6xl lg:max-w-full overflow-hidden">
        {" "}
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
        <div className="px-4 sm:p-4 my-4 sm:mt-0 ">
          <div className="flex flex-col xl:flex-row w-full justify-between gap-0 xl:gap-12 ">
            <div className="flex-1">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                  <div className="w-2 h-2 bg-[#c41d1ada] rounded-full"></div>
                  <h2 className="text-red-600 font-bold text-lg">
                    Compra N° {orderNo}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-6 sm:mb-8">
                {order.items?.map((item) => (
                  console.log("item", item),
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-red-200"
                  >
                    <div className="flex flex-row w-full gap-4">
                      <div className="relative w-28 h-28">
                        <Image
                          src={item?.image_url || "/avatar.jpeg"}
                          onClick={() => datailProducts(item.product?.id ?? 0)}
                          alt="Producto"
                          fill
                          className="rounded-xl object-cover border-2 border-red-100 cursor-pointer"
                          onError={(e) => {
                            e.currentTarget.src = "/avatar.jpeg";
                          }}
                          sizes="(max-width: 768px) 7rem, 7rem"
                        />
                      </div>
                      <div className="w-full">
                        <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                          {getProductName(item)}
                        </h3>
                        <div className="max-w-[550px]">
                          {item?.product_variant && (
                            <div className="flex flex-wrap gap-3 mb-4">
                              {item.product_variant.portions && (
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                                  <span className="text-red-500 text-lg">
                                    <Ruler />
                                  </span>
                                  {item.product_variant.portions}
                                </span>
                              )}
                              {item.product_variant.size_portion && (
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                                  <span className="text-red-500 text-lg">
                                    <Cake />
                                  </span>
                                  {item.product_variant.size_portion}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3 text-sm">
                          {item?.dedication_text && (
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border-l-4 border-red-400 shadow-sm max-w-[500px]">
                              <span className="font-semibold text-red-600 text-xs uppercase tracking-wider block mb-2">
                                💝 Dedicatoria
                              </span>
                              <span className="text-gray-800 italic font-medium leading-relaxed line-clamp-2">
                                "{item.dedication_text}"
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center sm:items-end">
                      <div className=" w-full border-gray-100 justify-between ">
                        <div className="flex items-center justify-between sm:justify-end text-gray-600 gap-2 ">
                          <span className=" font-medium">Subtotal:</span>
                          <span className="font-bold text-2xl">
                            {formatMoney(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.billing_data && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100">
                  <h4 className="font-bold text-red-600 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#c41d1ada]rounded-full"></div>
                    Datos de Facturación
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">RUC:</span>
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
                    <div className="flex flex-col sm:justify-between sm:flex-row">
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
            </div>

            <div className="pt-0 min-w-[300px] ">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mt-4">
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-red-600 ">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">Tipo de Entrega</span>
                  </div>
                  <div className="ml-0 sm:ml-11">
                    <span className="inline-flex items-center gap-2 bg-[#c41d1ada] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg w-full sm:w-auto justify-center sm:justify-start">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
                      RECOJO EN TIENDA
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-3 text-red-600 mb-3">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-lg">Tienda</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 space-y-2">
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

                  <div className="bg-white p-4 rounded-xl border-none ">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2  rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold  text-xs uppercase tracking-wider block">
                          Comprobante
                        </span>
                      </div>
                      <span className="text-gray-900  text-xs sm:text-base">
                        {order.voucher_type || "FACTURA"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="font-bold  text-xs uppercase tracking-wider block">
                          Medio de pago
                        </span>
                      </div>

                      <span className="text-gray-900 text-xs sm:text-base">
                        {order.payment_method ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg">
                          <BanknoteArrowUp className="w-5 h-5" />
                        </div>
                        <span className="font-bold  text-xs uppercase tracking-wider block">
                          Estado de pago
                        </span>
                      </div>
                      <span
                        className={` text-xs sm:text-base ${
                          order.payment_status === "pendiente"
                            ? "text-amber-600"
                            : "text-gray-900"
                        }`}
                      >
                        {order.payment_status === "pendiente"
                          ? "Pendiente"
                          : order.payment_status ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="font-bold  text-xs uppercase tracking-wider block">
                          Fecha de pago
                        </span>
                      </div>
                      <span className="text-gray-900  text-xs sm:text-base">
                        {formatDate(order.order_date)}
                      </span>
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
