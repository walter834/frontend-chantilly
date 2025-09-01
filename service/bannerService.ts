import { success } from "zod";
import api, { API_ROUTES } from "./api";
import { ApiBanner } from "@/types/api";

type UploadResult = {
  success: boolean;
  data?: ApiBanner;
  error?: string;
  fileName: string;
  isLimitError?: boolean;
  notProcessed?: boolean;
};

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

export const addBanner = async (image: File): Promise<ApiBanner> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await api.post("/banner", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export async function addBannersWithLimit(
  images: File[],
  maxSimultaneous: number = 3
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  const uploadOneImage = async (image: File): Promise<UploadResult> => {
    try {
      const response = await addBanner(image);
      return { success: true, data: response, fileName: image.name };
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Error al subir imagen";

      if (status === 422) {
        return {
          success: false,
          error: message,
          fileName: image.name,
          isLimitError: true,
        };
      }

      return { success: false, error: message, fileName: image.name };
    }
  };

  // Procesar en lotes
  for (let i = 0; i < images.length; i += maxSimultaneous) {
    const batch = images.slice(i, i + maxSimultaneous);
    const batchResults = await Promise.allSettled(batch.map(uploadOneImage));

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];

      if (result.status === "fulfilled") {
        results.push(result.value);

        if (result.value.isLimitError) {
          const processedCount = i + j + 1;
          const remaining = images.slice(processedCount);

          remaining.forEach((img) => {
            results.push({
              success: false,
              error: "No procesado debido al límite alcanzado",
              fileName: img.name,
              notProcessed: true,
            });
          });

          return results;
        }
      } else {
        results.push({
          success: false,
          error: "Error inesperado",
          fileName: batch[j].name,
        });
      }
    }
  }

  return results;
}

export const updateBannerOrder = async (
  id: number,
  display_order: string
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("display_order", display_order);

    const response = await api.post(`/banner/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBanner = async (id: number): Promise<void> => {
  try {
    await api.delete(`/banner/${id}`);
  } catch (err) {
    throw err;
  }
};

export const deleteAllBanners = async (): Promise<void> => {
  try {
    await api.delete("/banners/all");
  } catch (err) {
    throw err;
  }
};
