// services/orders.ts
import api from "../api";

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

type OrdersResponse = { customer_id: string; orders: Order[] };


export const getCostumerOrders = async (customerId: number): Promise<Order[]> => {
  try {
    const { data } = await api.get<OrdersResponse>("/orders", {
      params: { customer_id: customerId },
    });
    return data.orders ?? [];
  } catch (err: any) {
    // El backend devuelve 404 cuando no hay pedidos
    if (err?.response?.status === 404) return [];
    throw err;
  }
};
