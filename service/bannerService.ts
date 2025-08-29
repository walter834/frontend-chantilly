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

export const addBannersWithLimit = async (
  images: File[],
  maxSimultaneous: number = 3
) => {
  const allResults: any = [];

  const uploadOneImage = async (image: File) => {
    try {
      const response = await addBanner(image);

      return {
        success: true,
        data: response,
        fileName: image.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || "Error al subir imagen",
        fileName: image.name,
      };
    }
  };

  for (let i = 0; i < images.length; i += maxSimultaneous) {
    const imageGroup = images.slice(i, i + maxSimultaneous);
    const groupResults = await Promise.allSettled(
      imageGroup.map(uploadOneImage)
    );

    groupResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allResults.push(result.value);
      } else {
        allResults.push({
          success: false,
          error: "Error inesperado",
          fileName: imageGroup[index].name,
        });
      }
    });
  }
  return allResults;
};

export const deleteBanner = async (id: number): Promise<void> => {
  try {
    await api.delete(`/banner/${id}`);
  } catch (err) {
    throw err;
  }
};
