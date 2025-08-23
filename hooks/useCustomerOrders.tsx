// hooks/useCustomerOrders.ts
"use client";
import { useAuth } from "@/hooks/useAuth";
import { getCostumerOrders } from "@/service/order/orderService";


export function useCustomerOrders() {
  const { customerId } = useAuth();

  return getCostumerOrders(Number(customerId));
}
