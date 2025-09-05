import api from "../api";

export interface BannerSecondary {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  image_movil?: string;
}

export async function getBannerSecondary(): Promise<BannerSecondary[]> {
  try {
    const response = await api.get("/banner-secondary");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateBannerSecondaryImage(id: number, image: File) {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post(`/banner-secondary/${id}`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateBannerSecondary(id: number, formData: FormData) {
  try {
    const response = await api.post(`/banner-secondary/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
