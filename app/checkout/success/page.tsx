"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  // Any other fields returned by your backend
  [key: string]: any;
}

export default function SuccessPage() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastPaymentResult");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSummary(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">Resumen de Transacción</h1>

      {summary ? (
        <div className="bg-white shadow rounded overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <span className={`text-sm font-medium px-3 py-1 rounded ${summary?.approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {summary?.approved ? "Aprobado y completado con éxito" : "Transacción no aprobada"}
            </span>
            <span className="text-sm text-gray-500">{summary?.transactionDate || new Date().toLocaleString()}</span>
          </div>

          <table className="w-full text-sm">
            <tbody>
              <tr className="odd:bg-gray-50">
                <td className="p-3 font-medium w-1/3">Nro. Pedido</td>
                <td className="p-3">{summary?.orderNumber ?? summary?.purchaseNumber ?? "-"}</td>
              </tr>
              <tr className="odd:bg-gray-50">
                <td className="p-3 font-medium">Importe Pagado</td>
                <td className="p-3">{summary?.amount} {summary?.currency || "PEN"}</td>
              </tr>
              {summary?.cardHolder && (
                <tr className="odd:bg-gray-50">
                  <td className="p-3 font-medium">Tarjeta Habiente</td>
                  <td className="p-3">{summary.cardHolder}</td>
                </tr>
              )}
              {(summary?.cardMask || summary?.brand) && (
                <>
                  <tr className="odd:bg-gray-50">
                    <td className="p-3 font-medium">Tarjeta</td>
                    <td className="p-3">{summary?.cardMask || "-"}</td>
                  </tr>
                  <tr className="odd:bg-gray-50">
                    <td className="p-3 font-medium">Marca de Tarjeta</td>
                    <td className="p-3">{summary?.brand || "-"}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Productos si vienen */}
          {Array.isArray(summary?.products) && summary!.products.length > 0 && (
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
          )}

          {/* Fallback para depurar campos desconocidos */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <details>
              <summary className="cursor-pointer text-gray-600">Detalles técnicos</summary>
              <pre className="text-xs mt-2 overflow-auto whitespace-pre-wrap">{JSON.stringify(summary, null, 2)}</pre>
            </details>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">No hay información de pago disponible.</div>
      )}

      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <button onClick={() => window.print()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
          Imprimir
        </button>
        <Link href="/" className="bg-[#c41c1a] hover:opacity-90 text-white px-4 py-2 rounded">
          Ir a mis compras
        </Link>
      </div>
    </div>
  );
}
