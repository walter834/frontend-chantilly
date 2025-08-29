import api, { API_ROUTES } from "./api";
import { ApiBanner } from "@/types/api";

export async function getBanner(): Promise<ApiBanner[]> {
  try {
    const endpoint = API_ROUTES.BANNER;
    const { data } = await api.get<ApiBanner[]>(endpoint);
    return data;
  } catch (error) {
    console.error("Error fetching banner:", error);
    throw error;
  }
}

export async function updateBannerImage(id: number, image: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("image", image); 

    const response = await api.post(`/banner/${id}`, formData, {
      headers: {
        "Content-Type": undefined, // Esto elimina el header que estableció el interceptor
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw err;
  }
}
