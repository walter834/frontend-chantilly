import api, { API_ROUTES } from "./api";
import { ApiBanner } from "@/types/api";

export async function getBanner(): Promise<ApiBanner[]> {
    try {
        const endpoint = API_ROUTES.BANNER;
        const { data } = await api.get<ApiBanner[]>(endpoint);
        return data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
}