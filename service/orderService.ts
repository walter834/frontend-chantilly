import api, { API_ROUTES } from "./api";
import {
    ApiOrder,
    TransformedOrder,
    ApiInitSessionNiubizTransformed,
    NiubizInitSessionResponse,
    NiubizConfigResponse,
    NiubizSessionResponse,
    NiubizProcessResponse,
} from "@/types/api";

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

// New Niubiz flow
export async function getNiubizConfig(): Promise<NiubizConfigResponse> {
    const { data } = await api.get<NiubizConfigResponse>(API_ROUTES.NIUBIZ_CONFIG);
    return data;
}

export async function createNiubizSession(body: { amount: number; order_id: number }): Promise<NiubizSessionResponse> {
    console.log('body niubiz session:', body);
    const { data } = await api.post<NiubizSessionResponse>(API_ROUTES.NIUBIZ_SESSION, body);
    console.log('Niubiz session created:', data);
    return data;
}

export async function processNiubizPayment(body: { tokenId: string, amount: number, purchaseNumber: string }): Promise<NiubizProcessResponse> {
    console.log('body niubiz process:', body);
    const { data } = await api.post<NiubizProcessResponse>(API_ROUTES.NIUBIZ_PAY, body);
    console.log('Niubiz process response:', data);
    return data;
}