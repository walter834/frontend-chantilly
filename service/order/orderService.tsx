import api from "../api";

export const getCostumerOrders = async (customerId: number) => {
  const response = await api.get(`/customers/${customerId}/orders`);
  console.log("Orders fetched:", response.data);
  return response.data;
};

