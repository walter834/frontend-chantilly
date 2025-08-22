import api, { API_ROUTES } from "./api";
import { ApiOrder, TransformedOrder, ApiInitSessionNiubizTransformed, NiubizInitSessionResponse } from "@/types/api";

export async function createOrder(order: ApiOrder): Promise<TransformedOrder | null> {
    console.log('Creating order:', order);
    try {
        const endpoint = API_ROUTES.ORDERS;
        const { data } = await api.post<TransformedOrder>(endpoint, order);
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function createInitSessionNiubiz(order: ApiInitSessionNiubizTransformed): Promise<NiubizInitSessionResponse | null> {
    console.log('Creating init session niubiz:', order);
    try {
        const endpoint = API_ROUTES.INIT_SESSION_NIUBIZ;
        console.log('Endpoint:', endpoint);
        const { data } = await api.post<NiubizInitSessionResponse>(endpoint, order);
        return data;
    } catch (error) {
        console.error('Error creating init session niubiz:', error);
        throw error;
    }
}

// Procesar pago en backend propio
export interface ProcessPaymentPayload {
    tokenId: string;
    amount: number;
    purchaseNumber: string;
}

export async function processPayment(payload: ProcessPaymentPayload) {
    try {
        // usar URL absoluta provista por el usuario
        const url = "http://192.168.18.28:8000/api/pay";
        const { data } = await api.post(url, payload);
        return data;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}
