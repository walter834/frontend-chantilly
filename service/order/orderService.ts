import { Order } from "@/types/order";
import api from "../api";

type OrdersResponse = { customer_id: string; orders: Order[] };

/**
 *
 * @param customerId
 * @returns
 */
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

/**
 *
 * @param orderNumber
 * @returns
 */
export const getOrdersByNumber = async (
  orderNumber: string
): Promise<Order[]> => {
  try {
    const { data } = await api.get<OrdersResponse>("orders", {
      params: { orderNumber: orderNumber },
    });
    return data.orders ?? [];
  } catch (err: any) {
    if (err?.response?.status === 404) return [];
    throw err;
  }
};

export const getOrders = async (params: {
  customerId: number;
  orderNumber?: string;
  dateFilter?: string;
}): Promise<Order[]> => {
  try {
    const queryParams = {
      customer_id: params.customerId,
      order_number: params.orderNumber,
      date_filter: params.dateFilter
    };

    const { data } = await api.get<OrdersResponse>("/orders", {
      params: queryParams,
    });

    return data.orders ?? [];
  } catch (err: any) {
    if (err?.response?.status === 404) return [];
    throw err;
  }
};
