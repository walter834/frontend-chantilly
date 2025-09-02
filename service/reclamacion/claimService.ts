import api, { API_ROUTES } from "../api";

export async function createComplaint(data: any): Promise<any> {
    try {
        const endpoint = API_ROUTES.COMPLAINT;
        const { data: responseData } = await api.post(endpoint, data);
        return responseData;
    } catch (error) {
        console.error("Error creating complaint:", error);
        throw error;
    }
}

export async function getNextNumber(): Promise<any> {
    try {
        const endpoint = API_ROUTES.COMPLAINT + '/next-number';
        const { data: responseData } = await api.get(endpoint);
        return responseData;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    }
}