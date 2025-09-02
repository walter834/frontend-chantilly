"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/HeaderIndi/header";
import { processNiubizPayment, dataPayment } from "@/service/orderService";
import { parseNiubizDate, formatDate } from "@/lib/utils";
import Loading from '../components/loading';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getCustomerById } from "@/service/customerService";
import { getOrderById } from "@/service/orderService";

interface PaymentSummary {
  orderNumber?: string | number;
  amount?: number | string;
  currency?: string;
  cardHolder?: string;
  cardMask?: string;
  brand?: string;
  approved?: boolean | string;
  authorizedCode?: string;
  transactionDate?: string;
  products?: Array<{ name: string; detail?: string }>;
  name?: string;
  [key: string]: any;
}

export default function payconfirmation() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payment, setPayment] = useState<{
    description: string;
    amount: number;
    currency: string;
    success: boolean;
    order: string;
    date: Date;
    card: string;
    brand: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const processedRef = useRef(false);

/*   useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasParams = Boolean(
      searchParams.get("data") ||
      searchParams.get("transactionToken") ||
      searchParams.get("transactiontoken") ||
      searchParams.get("token")
    );
    const fromCheckout = sessionStorage.getItem('fromCheckout') === '1';
    if (!hasParams && !fromCheckout) {
      router.replace('/');
      return;
    }
    if (fromCheckout) sessionStorage.removeItem('fromCheckout');
  }, [searchParams, router]);

  useEffect(() => {
    try {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navType = entries && entries.length ? entries[0].type : undefined;
      const legacyType = (performance as any)?.navigation?.type;
      if (navType === 'reload' || legacyType === 1) {
        router.replace('/');
      }
    } catch {}
  }, [router]); */

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          console.error("No se encontró el token en la URL");
          setLoading(false);
          return;
        }

        const respondeData = await dataPayment(token);
        console.log("dataPayment", respondeData);

        if (!respondeData?.data) {
          throw new Error("Datos de pago inválidos");
        }

        const newOrder = JSON.parse(localStorage.getItem('temporal-order') || '{}');
        console.log("newOrder", newOrder);
        
        if (!newOrder?.customer_id) {
          throw new Error("No se pudo recuperar la información de la orden");
        }

        const response = await processNiubizPayment({ 
          tokenId: respondeData.data.tokenId, 
          amount: respondeData.data.amount, 
          purchaseNumber: respondeData.data.purchaseNumber, 
          order_data: newOrder 
        });
        
        console.log("response", response);
        
        const customer = await getCustomerById(newOrder.customer_id);
        const name = `${customer?.name || ''} ${customer?.lastname || ''}`.trim();

        const order = await getOrderById(response.data.purchase_number);
        console.log("getOrder", order);
        if (order?.orders?.[0]?.items) {
          setOrderItems(order.orders[0].items);
        }
        const data = { 
          response: response.data, 
          name: name || 'Cliente', 
          success: response.success 
        };
        
        convertionFormatData(data);
        localStorage.setItem('chantilly-cart', '');
        localStorage.removeItem('temporal-order');
        setLoading(false);
        
      } catch (e) {
        console.error("Error al procesar el pago:", e);
        setLoading(false);
      }
    };

    processPayment();
  }, []);

  function convertionFormatData(data: any) {
    console.log("data", data)
    const mapped = {
      description: data?.response?.action_description,
      amount: Number(data?.response?.amount),
      currency: data?.response?.currency,
      success: Boolean(data?.success),
      order: data?.response?.purchase_number,
      date: parseNiubizDate(String(data?.response?.transaction_date)),
      card: data?.response?.card,
      brand: data?.response?.brand,
      name: data?.name,
    };
    console.log("mapped", mapped)
    setPayment(mapped);
    setSummary(mapped);
    return mapped;
  }

  return (
    <>
      {loading && <Loading text="Procesando pago..." />}
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">Resumen de Transacción</h1>
        {summary ? (
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-center">
              <span className={`text-sm font-medium px-3 py-1 rounded ${payment?.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {payment?.success ? payment?.description : payment?.description}
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium w-1/3">Nro. Pedido</td>
                  <td className="p-3">0000{payment?.order ?? "-"}</td>
                </tr>
                {payment?.name && (
                  <tr className="odd:bg-gray-50">
                    <td className="p-3 font-medium">Tarjeta Habiente</td>
                    <td className="p-3">{payment.name}</td>
                  </tr>
                )}
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium">Fecha Y Hora de Transacción</td>
                  <td className="p-3">{payment?.date ? formatDate(payment.date) : new Date().toLocaleString()}</td>
                </tr>
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium">Importe Pagado</td>
                  <td className="p-3">{payment?.amount.toFixed(2)}</td>
                </tr>
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium">Moneda</td>
                  <td className="p-3">{payment?.currency}</td>
                </tr>
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium">Tarjeta</td>
                  <td className="p-3">{payment?.card}</td>
                </tr>
                {payment?.brand && (
                  <>
                    <tr className="odd:bg-gray-50">
                      <td className="p-3 font-medium">Marca de tarjeta</td>
                      <td className="p-3">{payment?.brand || "-"}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {orderItems.length > 0 && (
              <div className="p-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Productos</h3>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-start p-4 border rounded-lg">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.product?.short_description || item.product_variant?.description} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product?.short_description || item.product_variant?.description}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                        {item.dedication_text && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Dedicatoria:</span> {item.dedication_text}
                          </p>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        S/ {parseFloat(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No se encontraron detalles de la transacción</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <button onClick={() => window.print()} className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded cursor-pointer">
          Imprimir
        </button>
        <Link href="/" className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
          Seguir comprando
        </Link>
        <Link href="/my-orders" className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
          Ir a mis compras
        </Link>
      </div>
    </>
  );
}
