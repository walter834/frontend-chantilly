import { Order } from "@/types/order";
import api from "../api";

type OrdersResponse = { customer_id: string; orders: Order[] };

export const getCostumerOrders = async (
  customerId: number
): Promise<Order[]> => {
  try {
    const { data } = await api.get<OrdersResponse>("/orders", {
      params: { customer_id: customerId },
    });

    return data.orders ?? [];
  } catch (err: any) {
    if (err?.response?.status === 404) return [];
    throw err;
  }
};
