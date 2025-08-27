"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import { processNiubizPayment } from "@/service/orderService";
import { parseNiubizDate, formatDate } from "@/lib/utils";
import Loading from '../components/loading';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const processedRef = useRef(false);

  useEffect(() => {
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
  }, [router]);

  useEffect(() => {
    try {
      if (processedRef.current) return;
      processedRef.current = true;
      setLoading(true);
      console.log("searchParams", searchParams)
      const dataParam = searchParams.get("data");
      const txParam = searchParams.get("transactionToken") || searchParams.get("transactiontoken") || searchParams.get("token");
      let payload: any | null = null;

      if (dataParam) {
        try {
          const decoded = (() => { try { return decodeURIComponent(dataParam); } catch { return dataParam; } })();
          const base = JSON.parse(decoded);

          let products: Array<{ name: string; detail?: string }> | undefined;
          if (Array.isArray(base.items)) {
            products = base.items.map((it: any) => {
              const variantName = it?.product_variant?.description || it?.product_variant?.name;
              const productName = it?.product?.short_description || it?.product?.large_description || variantName || "Producto";
              const detailParts: string[] = [];
              if (it?.product_variant?.portions) detailParts.push(String(it.product_variant.portions));
              if (it?.product_variant?.size_portion) detailParts.push(String(it.product_variant.size_portion));
              if (it?.dedication_text) detailParts.push(`Dedicatoria: ${it.dedication_text}`);
              if (it?.delivery_date) detailParts.push(`Entrega: ${it.delivery_date}`);
              const detail = detailParts.join(" · ");
              return { name: productName, detail };
            });
          }

          payload = {
            ...base,
            transactionToken: txParam || base.transactionToken,
            products,
          };
          localStorage.setItem("lastPaymentResult", JSON.stringify(payload));
          setSummary(payload);
        } catch (e) {
          console.warn("No se pudo parsear 'data' del query param", e);
        }
      }
      if (!payload) {
        const raw = localStorage.getItem("lastPaymentResult");

        if (raw) {
          try { payload = JSON.parse(raw); } catch {}
        }
        if (payload) setSummary(payload);
      }

      if (!payload) {
        setLoading(false);
        return;
      }

      (async () => {
        try {
          const purchaseNumber = String(payload.purchaseNumber || payload.purchasenumber || payload.purchase_number || "");
          const amount = Number(payload.amount);
          const tokenId = payload.transactionToken || payload.tokenId;

          if (!tokenId) {
            setPayment({
              description: "Token de transacción no recibido",
              amount,
              currency: payload.currency || "PEN",
              success: false,
              order: purchaseNumber,
              date: new Date(),
              card: "-",
              brand: "-",
              name: payload.name || "",
            });
            return;
          }
          console.log("payload", payload)

          const response = await processNiubizPayment({ tokenId, amount, purchaseNumber, order_data: payload.orderData });
          const data = { response: response.data, name: payload.name, success: response.success };
          convertionFormatData(data);
          localStorage.setItem('chantilly-cart', '');

        } catch (e) {
          console.log("error", e);
        } finally {
          setLoading(false);
        }
      })();
    } catch {
      setLoading(false);
    }
  }, [searchParams]);

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
            <div className="px-4 py-3 border-b flex items-center justify-between">
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

            {Array.isArray(summary?.products) && summary!.products.length > 0 && (
              <div className="px-4 py-3 border-t">
                <div className="font-medium mb-2">Productos</div>
                <ul className="list-disc ml-6 space-y-1">
                  {summary!.products.map((p: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{p.name}</span>
                      {p.detail ? <span className="text-gray-600"> — {p.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">No hay información de pago disponible.</div>
        )}

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button onClick={() => window.print()} className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded cursor-pointer">
            Imprimir
          </button>
          <Link href="/" className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
            Seguir comprando
          </Link>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/my-orders`} className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
            Ir a mis compras
          </Link>
        </div>
      </div>
    </>
  );
}
