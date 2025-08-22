import api from "../api";

export const getCostumerOrders = async (customerId: number) => {
    const response = await api.get(`/customers/${customerId}/orders`);
    return response.data;
    }