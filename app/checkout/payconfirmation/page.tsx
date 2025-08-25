"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import { processNiubizPayment } from "@/service/orderService";
import { parseNiubizDate, formatDate } from "@/lib/utils";
import Loading from '../components/loading';

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

  useEffect(() => {

    try {
      setLoading(true);
      const raw = localStorage.getItem("lastPaymentResult");
      console.log("raw", raw);

      if (raw) {
        (async () => {
          try {
            const parsed = JSON.parse(raw);
            setSummary(parsed);

            console.log("parsed", parsed)
            const response = await processNiubizPayment({
              tokenId: parsed.transactionToken,
              amount: Number(parsed.amount),
              purchaseNumber: parsed.purchasenumber,
            });
            console.log("response", response)
            const data = {
              response: response.data,
              name: parsed.name,
              success: response.success
            }
            
            convertionFormatData(data)
          } catch (e) {
            console.log("error", e)
          }finally{
            setLoading(false);
          }
        })()

      }
    } catch {
      // ignore
    }
  }, []);

  function convertionFormatData(data: any) {
    console.log("data", data)
    const mapped = {
      description: data?.response?.action_description,
      amount: data?.response?.amount,
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

            {/* {Array.isArray(summary?.products) && summary!.products.length > 0 && (
              <div className="px-4 py-3 border-t">
                <div className="font-medium mb-2">Productos</div>
                <ul className="list-disc ml-6 space-y-1">
                  {summary!.products.map((p, i) => (
                    <li key={i}>
                      <span className="font-medium">{p.name}</span>
                      {p.detail ? <span className="text-gray-600"> — {p.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
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
          <Link href="/" className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
            Ir a mis compras
          </Link>
        </div>
      </div>
    </>
  );
}
