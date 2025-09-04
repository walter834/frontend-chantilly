import api from "../api";

export interface ApiVariant {
  id: number;
  product_id: number;
  description: string;
  portions: string;
  price: string;
  hours: number;
  status: null;

  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  url: string;
  is_primary: number;
}
export interface Variant {
  id: number;
  product_id: number;
  description: string;
  portions: string;
  price: string;
  hours: number;
  image: VariantImage[];
  primaryImage?: string;
}

export async function getVariants(): Promise<Variant[]> {
  try {
    const { data } = await api.get("/products-variant/all");

    const transformedVariant: Variant[] = data.map((apiVariant: ApiVariant) => {
      const primaryImage = apiVariant.images.find(
        (img) => img.is_primary === 1
      );
      return {
        id: apiVariant.id,

        description: apiVariant.description,
        image: primaryImage?.url,
        images: apiVariant.images,
      };
    });

    console.log(transformedVariant);
    return transformedVariant;
  } catch (err) {
    throw err;
  }
}

export async function updateVariantImage(
  id: number,
  images: File[]
): Promise<{ message: string; product: ApiVariant }> {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    const response = await api.post(`/products-variant/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getVariantsByProduct(
  productId: number
): Promise<Variant[]> {
  try {
    const { data } = await api.get(`/products-variant/${productId}`);
    const transformedVariant: Variant[] = data.data.map(
      (apiVariant: ApiVariant) => ({
        id: apiVariant.id,
        product_id: apiVariant.product_id,

        description: apiVariant.description,
        image: apiVariant.images,
        primaryImage:
          apiVariant.images.find((img) => img.is_primary === 1)?.url ||
          apiVariant.images[0]?.url ||
          null,
      })
    );
    console.log(transformedVariant)
    return transformedVariant;
  } catch (error) {
    throw error;
  }
}
